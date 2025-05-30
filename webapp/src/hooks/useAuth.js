import { create } from 'zustand'

// Mock user for development
const mockUser = {
  id: '123456789',
  username: 'TestUser',
  isAdmin: true
}

const useAuthStore = create((set) => ({
  isAuthenticated: true, // Auto-authenticated for development
  user: mockUser,
  setAuth: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))

export function useAuth() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore()

  const login = async (code) => {
    // Mock login for development
    setAuth(mockUser)
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  }
}