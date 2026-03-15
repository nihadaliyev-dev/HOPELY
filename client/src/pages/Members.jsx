import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, MessageSquare, Loader2 } from 'lucide-react'
import { useCommunity } from '../context/CommunityContext'
import { useToast } from '../context/ToastContext'
import { dashboardService } from '../services/dashboardService'
import './Members.css'

const labelColors = {
  brand: { text: 'var(--brand-primary)', bg: 'var(--brand-glow)' },
  info:  { text: 'var(--info)',          bg: 'var(--info-glow)' },
  critical: { text: 'var(--critical)',   bg: 'var(--critical-glow)' },
  warning:  { text: 'var(--warning)',    bg: 'var(--warning-glow)' },
  healthy:  { text: 'var(--healthy)',    bg: 'var(--healthy-glow)' },
}

export default function Members() {
  const { activeCommunity } = useCommunity()
  const [membersList, setMembersList] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const [filter, setFilter] = useState('All')

  useEffect(() => {
    if (!activeCommunity) return
    let isMounted = true
    setLoading(true)

    dashboardService.getMembers(activeCommunity.id)
      .then(data => {
        if (isMounted) setMembersList(data)
      })
      .catch(err => {
        console.error(err)
        if (isMounted) addToast({ type: 'error', message: 'Failed to load members' })
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [activeCommunity, addToast])

  const labelFilters = ['All', 'Catalyst', 'Expert', 'At Risk', 'Re-engage Candidate', 'Silent Reader']
  const filtered = filter === 'All' ? membersList : membersList.filter(m => m.label === filter)

  const catalysts = membersList.filter(m => m.label === 'Catalyst')
  const atRisk = membersList.filter(m => m.label === 'At Risk' || m.label === 'Re-engage Candidate')

  return (
    <div className="members-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Community Intelligence</h1>
          <p>Member activity, engagement trends, and AI-powered labels</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="members-summary">
        <div className="member-summary-card card">
          <span className="ms-val">{membersList.length}</span>
          <span className="ms-label">Total Tracked</span>
        </div>
        <div className="member-summary-card card">
          <span className="ms-val" style={{ color: 'var(--brand-primary)' }}>{catalysts.length}</span>
          <span className="ms-label">Catalysts</span>
        </div>
        <div className="member-summary-card card">
          <span className="ms-val" style={{ color: 'var(--critical)' }}>{atRisk.length}</span>
          <span className="ms-label">At Risk</span>
        </div>
        <div className="member-summary-card card">
          <span className="ms-val" style={{ color: 'var(--info)' }}>
            {membersList.filter(m => m.label === 'Silent Reader').length}
          </span>
          <span className="ms-label">Silent Readers</span>
        </div>
      </div>

      {/* Label filters */}
      <div className="members-filters">
        {labelFilters.map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>

      <div className="members-grid">
        {loading ? (
          <div className="flex items-center justify-center p-12 w-full" style={{ gridColumn: '1 / -1' }}>
            <Loader2 className="animate-spin text-brand" size={24} />
          </div>
        ) : (
          filtered.map(member => (
            <MemberCard key={member.id} member={member} />
          ))
        )}
      </div>
    </div>
  )
}

function MemberCard({ member }) {
  const lc = labelColors[member.labelColor] || labelColors.brand
  const TrendIcon = member.trend === 'up' ? TrendingUp : member.trend === 'down' ? TrendingDown : Minus
  const trendColor = member.trend === 'up' ? 'var(--healthy)' : member.trend === 'down' ? 'var(--critical)' : 'var(--text-muted)'

  // Generate mini activity bars
  const bars = Array.from({ length: 7 }, (_, i) => {
    const base = member.messages7d / 7
    const h = Math.max(4, Math.min(32, (base * (0.5 + Math.random())) | 0))
    return h
  })

  return (
    <div className="member-card card card-glow">
      {/* Header */}
      <div className="member-card-header">
        <div className="member-avatar" style={{ background: member.color }}>
          {member.avatar}
        </div>
        <div className="member-info">
          <div className="member-name">{member.name}</div>
          <div className="member-username">{member.username}</div>
        </div>
        <div
          className="member-label-chip"
          style={{ color: lc.text, background: lc.bg }}
        >
          {member.label}
        </div>
      </div>

      <div className="member-role">{member.role}</div>

      {/* Mini bar chart */}
      <div className="member-bars">
        <div className="member-bars-inner">
          {bars.map((h, i) => (
            <div
              key={i}
              className="member-bar"
              style={{ height: h, background: member.color, opacity: 0.5 + i * 0.07 }}
            />
          ))}
        </div>
        <span className="member-bars-label">7-day activity</span>
      </div>

      {/* Stats */}
      <div className="member-stats">
        <div className="member-stat">
          <span className="member-stat-val">
            <MessageSquare size={11} style={{ display: 'inline', marginRight: 3 }} />
            {member.messages7d}
          </span>
          <span className="member-stat-key">msgs / 7d</span>
        </div>
        <div className="member-stat">
          <span className="member-stat-val" style={{ color: trendColor }}>
            <TrendIcon size={12} style={{ display: 'inline', marginRight: 2 }} />
            {member.trend}
          </span>
          <span className="member-stat-key">trend</span>
        </div>
        <div className="member-stat">
          <span className="member-stat-val">{member.joinedDays}d</span>
          <span className="member-stat-key">member age</span>
        </div>
      </div>

      {/* Active channels */}
      <div className="member-channels">
        {member.activeIn.slice(0, 3).map(ch => (
          <span key={ch} className="member-channel-tag">{ch}</span>
        ))}
        {member.activeIn.length > 3 && (
          <span className="member-channel-more">+{member.activeIn.length - 3}</span>
        )}
      </div>

      {/* Last seen for at-risk */}
      {member.lastSeen && (
        <div className="member-last-seen">
          <span>Last seen: </span><span style={{ color: 'var(--critical)' }}>{member.lastSeen}</span>
        </div>
      )}

      {/* Action */}
      <div className="member-action">
        {(member.label === 'At Risk' || member.label === 'Re-engage Candidate') && (
          <button className="btn btn-danger btn-sm w-full" style={{ justifyContent: 'center' }}>
            Re-engage
          </button>
        )}
        {member.label === 'Catalyst' && (
          <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', color: 'var(--brand-primary)' }}>
            View Contributions
          </button>
        )}
      </div>
    </div>
  )
}
