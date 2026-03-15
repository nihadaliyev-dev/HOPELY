import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Loader2 } from 'lucide-react'

/**
 * AuthCallback — handles the Discord OAuth2 redirect.
 * Discord redirects to /auth/callback?code=...
 * This page extracts the code, exchanges it for a JWT, then navigates forward.
 */
export default function AuthCallback() {
  const [status, setStatus] = useState('Connecting to Discord...')
  const [error, setError] = useState(null)
  const { exchangeDiscordCode } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')

    if (errorParam) {
      setError('Discord authorization was denied. Please try again.')
      return
    }

    if (!code) {
      setError('No authorization code received from Discord.')
      return
    }

    async function handleCallback() {
      try {
        setStatus('Verifying your Discord account...')
        await exchangeDiscordCode(code)
        setStatus('Fetching your servers...')
        // Small delay so user can read the status
        await new Promise(r => setTimeout(r, 600))
        navigate('/select-server', { replace: true })
      } catch (err) {
        console.error('[AuthCallback] error:', err)
        setError(err.message || 'Authentication failed. Please try again.')
      }
    }

    handleCallback()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      gap: '1.5rem',
      padding: '2rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          PulseCheck <span style={{ color: '#6366F1' }}>AI</span>
        </span>
      </div>

      {error ? (
        <>
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '1rem 1.5rem',
            color: '#ef4444',
            textAlign: 'center',
            maxWidth: 360,
          }}>
            {error}
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: 8,
              border: '1px solid var(--border-primary)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ← Back to Login
          </button>
        </>
      ) : (
        <>
          <Loader2
            size={36}
            style={{ color: '#6366F1', animation: 'spin 1s linear infinite' }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {status}
          </p>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
