import { useState, useEffect, createContext, useContext } from 'react'
import { communityService } from '../services/communityService'
import { useAuth } from './AuthContext'

const CommunityContext = createContext(null)

export function CommunityProvider({ children }) {
  const { user } = useAuth()  // Now safe — CommunityProvider is inside AuthProvider
  const [communities, setCommunities] = useState([])
  const [activeCommunity, setActiveCommunity] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Re-fetch guilds whenever the user changes (login / logout)
  useEffect(() => {
    if (!user) {
      setCommunities([])
      setActiveCommunity(null)
      setAnalysisResult(null)
      return
    }

    setIsLoading(true)
    communityService.getCommunities()
      .then(data => setCommunities(data))
      .catch(err => console.error('[CommunityContext] Failed to load communities:', err))
      .finally(() => setIsLoading(false))
  }, [user])

  /**
   * Trigger Gemini AI analysis for a guild.
   * Call with activeCommunity.id from any page.
   */
  const analyzeServer = async (guildId) => {
    if (!guildId) return
    setIsAnalyzing(true)
    setAnalysisResult(null)
    try {
      const result = await communityService.analyzeGuild(guildId)
      setAnalysisResult(result)
      return result
    } catch (err) {
      console.error('[CommunityContext] Analysis failed:', err)
      throw err
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <CommunityContext.Provider value={{
      communities,
      activeCommunity,
      setActiveCommunity,
      isLoading,
      analysisResult,
      isAnalyzing,
      analyzeServer,
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => useContext(CommunityContext)
