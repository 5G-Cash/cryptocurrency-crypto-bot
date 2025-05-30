import { create } from 'zustand'
import axios from 'axios'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))

export function useAuth() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore()

  const login = async (code) => {
    try {
      const { data } = await axios.post('/api/auth/discord', { code })
      setAuth(data)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  }
}