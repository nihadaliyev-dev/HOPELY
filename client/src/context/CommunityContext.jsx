import { useState, useEffect, createContext, useContext } from 'react'
import { communityService } from '../services/communityService'

const CommunityContext = createContext(null)

export function CommunityProvider({ children }) {
  const [communities, setCommunities] = useState([])
  const [activeCommunity, setActiveCommunity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    communityService.getCommunities()
      .then(data => {
        setCommunities(data)
        if (data.length > 0) setActiveCommunity(data[0])
      })
      .catch(err => console.error("Failed to load communities", err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <CommunityContext.Provider value={{
      communities,
      activeCommunity,
      setActiveCommunity,
      isLoading
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => useContext(CommunityContext)
