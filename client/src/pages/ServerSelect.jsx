import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommunity } from '../context/CommunityContext'
import { useAuth } from '../context/AuthContext'
import { Zap, Search, Users, ChevronRight, LogOut, Loader2, ServerCrash } from 'lucide-react'
import './ServerSelect.css'

export default function ServerSelect() {
  const { communities, isLoading, setActiveCommunity } = useCommunity()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selecting, setSelecting] = useState(null)

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = async (guild) => {
    setSelecting(guild.id)
    setActiveCommunity(guild)
    // small delay for animation feel
    await new Promise(r => setTimeout(r, 400))
    navigate('/overview', { replace: true })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="ss-container">
      {/* Background blobs */}
      <div className="ss-blob ss-blob-1" />
      <div className="ss-blob ss-blob-2" />

      <motion.div
        className="ss-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="ss-header">
          <div className="ss-logo">
            <div className="ss-logo-icon">
              <Zap size={18} fill="currentColor" />
            </div>
            PulseCheck <span>AI</span>
          </div>
          <button className="ss-logout-btn" onClick={handleLogout} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>

        {/* User greeting */}
        <div className="ss-welcome">
          {user?.avatar && (
            <img src={user.avatar} alt={user.displayName} className="ss-avatar" />
          )}
          <div className="ss-welcome-text">
            <h1>Select a Server</h1>
            <p>
              Signed in as <strong>{user?.displayName || user?.username || user?.email}</strong>
              . Choose the Discord server you want to analyze.
            </p>
          </div>
        </div>

        {/* Discord badge */}
        <div className="ss-discord-badge">
          <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.67,77.67,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          Showing servers where you are Administrator
        </div>

        {/* Search */}
        {!isLoading && communities.length > 0 && (
          <div className="ss-search-wrap">
            <Search size={16} className="ss-search-icon" />
            <input
              type="text"
              placeholder="Search your servers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ss-search-input"
            />
          </div>
        )}

        {/* Server list */}
        <div className="ss-list">
          {isLoading ? (
            <div className="ss-state-center">
              <Loader2 size={32} className="ss-spinner" />
              <p>Loading your servers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ss-state-center">
              <ServerCrash size={40} style={{ color: 'var(--text-muted)' }} />
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                {communities.length === 0
                  ? 'No servers found where you have Administrator permissions.'
                  : 'No servers match your search.'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((guild, i) => (
                <motion.button
                  key={guild.id}
                  className={`ss-guild-item ${selecting === guild.id ? 'ss-guild-selecting' : ''}`}
                  onClick={() => handleSelect(guild)}
                  disabled={!!selecting}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                >
                  <img
                    src={guild.icon}
                    alt={guild.name}
                    className="ss-guild-icon"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(guild.name)}&background=5865F2&color=fff&size=64`
                    }}
                  />
                  <div className="ss-guild-info">
                    <span className="ss-guild-name">{guild.name}</span>
                    {guild.memberCount != null && (
                      <span className="ss-guild-meta">
                        <Users size={12} />
                        {guild.memberCount.toLocaleString()} members
                      </span>
                    )}
                  </div>
                  <div className="ss-guild-action">
                    {selecting === guild.id ? (
                      <Loader2 size={18} className="ss-spinner" />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}
