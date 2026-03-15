import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './Auth.css'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithDiscord } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email || 'admin@pulsecheck.ai', password || 'password')
      navigate('/overview')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Redirects the browser to Discord's OAuth2 authorization page.
   * Requires VITE_DISCORD_CLIENT_ID to be set in .env
   * The user will be redirected back to /auth/callback?code=...
   */
  const handleDiscord = () => {
    setError('')
    setLoading(true)
    try {
      loginWithDiscord() // triggers window.location.href redirect
    } catch (err) {
      setError('Failed to initiate Discord login. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Left side: Branding / Visuals */}
      <div className="auth-brand">
        <div className="auth-brand-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <Zap size={24} fill="currentColor" />
              </div>
              PulseCheck <span>AI</span>
            </div>
            
            <h1 className="auth-tagline">
              Stop guessing. Start <span>knowing.</span>
            </h1>
            <p className="auth-description">
              The AI-powered command center for community health. Detect dead zones, analyze sentiment, and automatically revive engagement.
            </p>
          </motion.div>

          {/* Decorative floating elements */}
          <div className="auth-decorations">
            <motion.div 
              className="auth-dec auth-dec-1"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="pulse-dot"></div>
              #general sentiment +18%
            </motion.div>
            <motion.div 
              className="auth-dec auth-dec-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              ⚠️ 3 channels going dead
            </motion.div>
          </div>
        </div>
        
        {/* Abstract background blobs */}
        <div className="auth-bg-blob blob-1"></div>
        <div className="auth-bg-blob blob-2"></div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
            <div className="auth-tab-indicator" style={{ transform: `translateX(${mode === 'login' ? '0' : '100%'})` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="auth-form-content"
            >
              <h2>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
              <p className="auth-subtitle">
                {mode === 'login' 
                  ? 'Connect your Discord account to get started' 
                  : 'Start monitoring your community for free'}
              </p>

              {/* ── Discord OAuth Button ── */}
              <button 
                type="button"
                className="auth-social-btn discord-btn"
                onClick={handleDiscord}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.67,77.67,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                {loading ? 'Redirecting to Discord...' : 'Continue with Discord'}
              </button>
              
              <div className="auth-divider">
                <span>or continue with email</span>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <div className="auth-error-message">
                    {error}
                  </div>
                )}
                {mode === 'register' && (
                  <div className="auth-input-group">
                    <label>Full Name</label>
                    <div className="auth-input-wrap">
                      <input type="text" placeholder="Jane Doe" required />
                    </div>
                  </div>
                )}

                <div className="auth-input-group">
                  <label>Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail size={18} className="auth-input-icon" />
                    <input 
                      type="email" 
                      placeholder="you@company.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <div className="auth-label-row">
                    <label>Password</label>
                    {mode === 'login' && <a href="#" className="auth-forgot">Forgot?</a>}
                  </div>
                  <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
