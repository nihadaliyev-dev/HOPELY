import { useState, createContext, useContext } from 'react'

const CommunityContext = createContext(null)

export const MOCK_COMMUNITIES = [
  { id: '1', name: 'PulseCheck HQ', platform: 'Discord', members: 1420, icon: 'P' },
  { id: '2', name: 'React Developers', platform: 'Slack', members: 8900, icon: 'R' },
  { id: '3', name: 'Crypto Alpha Team', platform: 'Telegram', members: 340, icon: 'C' }
]

export function CommunityProvider({ children }) {
  const [activeCommunity, setActiveCommunity] = useState(MOCK_COMMUNITIES[0])

  return (
    <CommunityContext.Provider value={{
      communities: MOCK_COMMUNITIES,
      activeCommunity,
      setActiveCommunity
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => useContext(CommunityContext)
