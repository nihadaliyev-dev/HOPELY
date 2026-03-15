import { useState, createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // null means unauthenticated

  const login = (email, password) => {
    // Mock login
    setUser({
      name: 'Admin User',
      email,
      role: 'Community Manager',
      avatar: 'A'
    })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
