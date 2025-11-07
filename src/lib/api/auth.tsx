import { type LoginType, type RegisterType } from '@/schemas/auth'
import { getAPIUrl } from '@/config/api';

/**
 * Handles new user registration
 * POST /user/register
 */
export const registerUser = async (data: RegisterType) => {
  const response = await fetch(getAPIUrl('user/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    // Provide meaningful error messages from the NestJS backend
    const errorData = await response.json()
    throw new Error(errorData.message || 'Registration failed')
  }

  // Return the success response (e.g., { message: 'User created' })
  return response.json()
}

/**
 * Handles user login
 * POST /user/login (Assumed endpoint)
 */
export const loginUser = async (data: LoginType) => {
  // We assume a standard /user/login endpoint for your NestJS backend
  const response = await fetch(getAPIUrl('user/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Invalid email or password')
  }

  // We assume the backend returns a token on successful login
  // e.g., { user: {...}, token: '...' }
  const result = await response.json()
  if (!result.token) {
    throw new Error('Login response did not include a token.')
  }
  return result
}