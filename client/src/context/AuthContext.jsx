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

  const login = async (email, password) => {
    const { token, user: userData } = await authService.login(email, password)
    localStorage.setItem('pulsecheck_token', token)
    setUser(userData)
  }

  const loginWithDiscord = async (code) => {
    const { token, user: userData } = await authService.loginWithDiscord(code)
    localStorage.setItem('pulsecheck_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('pulsecheck_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, loginWithDiscord, logout }}>
      {!isInitializing && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
