import { useState, useEffect, createContext, useContext } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    authService.getCurrentUser()
      .then(userData => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setIsInitializing(false))
  }, [])

  /** Standard email/password login (admin fallback) */
  const login = async (email, password) => {
    const { token, user: userData } = await authService.login(email, password)
    localStorage.setItem('pulsecheck_token', token)
    setUser(userData)
  }

  /**
   * Called by AuthCallback after Discord redirects back with ?code=
   * Exchanges the code for a JWT and stores it.
   */
  const exchangeDiscordCode = async (code) => {
    const { token, user: userData } = await authService.exchangeDiscordCode(code)
    localStorage.setItem('pulsecheck_token', token)
    setUser(userData)
    return userData
  }

  /** Initiates Discord OAuth2 redirect — browser leaves the app */
  const loginWithDiscord = () => {
    authService.redirectToDiscord()
  }

  const logout = () => {
    localStorage.removeItem('pulsecheck_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isInitializing,
      login,
      loginWithDiscord,
      exchangeDiscordCode,
      logout,
    }}>
      {!isInitializing && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
