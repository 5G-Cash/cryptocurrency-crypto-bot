import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

const DISCORD_CLIENT_ID = process.env.VITE_DISCORD_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/callback`

function Login() {
  const { login } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      login(code)
    }
  }, [login])

  const handleLogin = () => {
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            5G-CASH Discord Bot Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login with Discord to access your wallet information
          </p>
        </div>
        <button
          onClick={handleLogin}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login with Discord
        </button>
      </div>
    </div>
  )
}

export default Login