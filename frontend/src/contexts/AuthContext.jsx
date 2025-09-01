import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('civicpulse_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('civicpulse_user')
      }
    }
    setLoading(false)
  }, [])

  const API_BASE_URL = 'http://localhost:5000/api'

  // Mock login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      const { user, token } = response.data

      const userData = { ...user, token }
      setUser(userData)
      localStorage.setItem('civicpulse_user', JSON.stringify(userData))
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message)
      throw new Error(error.response?.data?.message || 'Invalid email or password')
    }
  }

  // Mock register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
      const { user, token } = response.data

      const newUserData = { ...user, token }
      setUser(newUserData)
      localStorage.setItem('civicpulse_user', JSON.stringify(newUserData))
      return { success: true, user: newUserData }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message)
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('civicpulse_user')
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const token = user?.token
      if (!token) {
        throw new Error('No authentication token found')
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.put(`${API_BASE_URL}/users/profile`, updates, config)
      const updatedUser = { ...response.data.user, token } // Preserve token
      setUser(updatedUser)
      localStorage.setItem('civicpulse_user', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update failed:', error.response?.data?.message || error.message)
      throw new Error(error.response?.data?.message || 'Profile update failed')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
