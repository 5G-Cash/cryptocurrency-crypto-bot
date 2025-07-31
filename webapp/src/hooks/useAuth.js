import { create } from 'zustand'

// Authentication store
const useAuthStore = create((set) => ({
  // Start unauthenticated until the OAuth flow completes
  isAuthenticated: false,
  user: null,
  setAuth: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => {
    localStorage.removeItem('token')
    set({ isAuthenticated: false, user: null })
  }
}))

export function useAuth() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore()

  const login = async (code) => {
    try {
      const res = await fetch('/api/auth/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (!res.ok) throw new Error('Authentication failed')

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setAuth(data.user)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  }
}