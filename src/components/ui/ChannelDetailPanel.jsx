import { X, AlertTriangle, Clock, MessageSquare, Users, TrendingDown, Sparkles, Send, Shield } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { channelActivityData } from '../../data/mockData'
import './ChannelDetailPanel.css'

const issueLabels = {
  inactivity: { label: 'Inactivity detected', icon: Clock, color: 'critical' },
  repetitive_messages: { label: 'Repetitive low-quality messages', icon: MessageSquare, color: 'warning' },
  low_sentiment: { label: 'Low sentiment score', icon: TrendingDown, color: 'warning' },
  no_expert: { label: 'No expert participation', icon: Users, color: 'critical' },
  disengaged_members: { label: 'Top members disengaged', icon: Users, color: 'critical' },
  low_engagement: { label: 'Below average engagement', icon: TrendingDown, color: 'warning' },
}

const sparks = [
  'What would double engagement in this channel?',
  'Share your top resource or tool from this week',
  'Hot take: What\'s the most overrated concept in this field?',
]

export default function ChannelDetailPanel({ channel, onClose }) {
  const riskColor = { healthy: 'var(--healthy)', warning: 'var(--warning)', critical: 'var(--critical)' }[channel.risk]
  const riskBadgeClass = `badge-${channel.risk === 'healthy' ? 'healthy' : channel.risk === 'warning' ? 'warning' : 'critical'}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="channel-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="channel-panel-header">
          <div className="channel-panel-title">
            <h2>{channel.name}</h2>
            <span className={`badge ${riskBadgeClass}`}>{channel.risk}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="channel-panel-body">
          {/* Health Score */}
          <div className="panel-health-row">
            <div className="panel-health-score" style={{ borderColor: riskColor, color: riskColor }}>
              {channel.activity}
              <span className="panel-health-label">Health</span>
            </div>
            <div className="panel-stats-grid">
              <div className="panel-stat">
                <span className="panel-stat-val">{channel.messages24h}</span>
                <span className="panel-stat-key">msgs/24h</span>
              </div>
              <div className="panel-stat">
                <span className="panel-stat-val">{channel.members}</span>
                <span className="panel-stat-key">members</span>
              </div>
              <div className="panel-stat">
                <span className="panel-stat-val">{channel.sentiment}%</span>
                <span className="panel-stat-key">sentiment</span>
              </div>
              <div className="panel-stat">
                <span className="panel-stat-val" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  {channel.lastActive}
                </span>
                <span className="panel-stat-key">last active</span>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="panel-section">
            <h3 className="panel-section-title">Activity (14 days)</h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={channelActivityData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--text-primary)', fontSize: 11 }}
                  itemStyle={{ color: riskColor, fontSize: 11 }}
                />
                <Bar dataKey="messages" fill={riskColor} radius={[4,4,0,0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Issues */}
          {channel.issues.length > 0 && (
            <div className="panel-section">
              <h3 className="panel-section-title">AI-Detected Issues</h3>
              <div className="panel-issues">
                {channel.issues.map(issue => {
                  const def = issueLabels[issue]
                  if (!def) return null
                  const Icon = def.icon
                  return (
                    <div key={issue} className={`panel-issue panel-issue--${def.color}`}>
                      <Icon size={13} />
                      <span>{def.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Sparks */}
          <div className="panel-section">
            <h3 className="panel-section-title"><Sparkles size={13} style={{ display: 'inline', marginRight: 6 }} />Discussion Spark Suggestions</h3>
            <div className="panel-sparks">
              {sparks.map((spark, i) => (
                <div key={i} className="panel-spark-item">
                  <p className="panel-spark-text">"{spark}"</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm">Edit</button>
                    <button className="btn btn-primary btn-sm">
                      <Send size={11} /> Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="panel-section">
            <h3 className="panel-section-title">Recommended Actions</h3>
            <div className="panel-actions">
              <div className="panel-action-item">
                <div className="panel-action-num">1</div>
                <span>Post a targeted discussion spark to re-activate expert members</span>
              </div>
              <div className="panel-action-item">
                <div className="panel-action-num">2</div>
                <span>Tag top 3 contributors who haven't posted in 48+ hours</span>
              </div>
              <div className="panel-action-item">
                <div className="panel-action-num">3</div>
                <span>Review last 20 messages for community friction signals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="channel-panel-footer">
          <button className="btn btn-secondary" style={{ flex: 1 }}>
            <Shield size={13} /> Schedule Review
          </button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Sparkles size={13} /> Publish Spark
          </button>
        </div>
      </div>
    </div>
  )
}
