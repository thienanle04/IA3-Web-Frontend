import React, { createContext, useContext, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// --- 1. Define Types ---

type User = {
  id: string
  email: string
  fullName: string
  // Add other user profile fields here
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (token: string) => void // Function to handle successful login
  logout: () => void // Function to handle logout
}

// --- 2. Create the Context ---

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// --- 3. Mock API Call for User Profile ---

// In a real application, this would fetch the user from a secure endpoint
const fetchUserProfile = async (): Promise<User | null> => {
  // Check for stored token (e.g., in localStorage)
  const token = localStorage.getItem('authToken')
  if (!token) {
    return null
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simulate successful fetch
  return {
    id: 'user-123',
    email: 'testuser@app.com',
    fullName: 'Demo User',
  }
}

// --- 4. Auth Provider Component ---

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  // Use React Query to fetch the user's profile
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchUserProfile,
    staleTime: Infinity, // User profile data rarely changes during a session
  })
  
  const isLoggedIn = !!user

  // Function to handle login success
  const login = (token: string) => {
    // 1. Store the token securely (e.g., localStorage, cookie)
    localStorage.setItem('authToken', token)
    
    // 2. Invalidate the 'currentUser' query to force a refetch of the profile
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
  }

  // Function to handle logout
  const logout = () => {
    // 1. Remove the token
    localStorage.removeItem('authToken')

    // 2. Reset the query cache for 'currentUser' and set it to null
    queryClient.setQueryData(['currentUser'], null)

    // 3. Invalidate/clear all other user-specific data in the cache if necessary
    queryClient.clear()
    
    // Optional: Redirect to login page using TanStack Router
    // router.navigate({ to: '/login' }) 
  }

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user: user || null,
    isLoggedIn,
    isLoading,
    login,
    logout,
  }), [user, isLoading])

  if (isLoading) {
    // Optional: Render a full-screen spinner while fetching initial auth state
    return <div>Loading initial user state...</div> 
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// --- 5. Custom Hook for Usage ---

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}