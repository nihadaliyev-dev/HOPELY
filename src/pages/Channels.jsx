import { useState } from 'react'
import { channels } from '../data/mockData'
import ChannelDetailPanel from '../components/ui/ChannelDetailPanel'
import { Search } from 'lucide-react'
import './Channels.css'

export default function Channels() {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="channels-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Channels</h1>
          <p>All monitored channels with health scores and engagement metrics</p>
        </div>
      </div>

      <div className="channels-search-wrap">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search channels..."
          className="input"
          style={{ paddingLeft: 32, width: 300 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="channels-table card">
        {/* Header */}
        <div className="channels-table-header">
          <span>Channel</span>
          <span>Category</span>
          <span>Activity</span>
          <span>Sentiment</span>
          <span>Messages/24h</span>
          <span>Last Active</span>
          <span>Status</span>
        </div>
        {/* Rows */}
        {filtered.map(ch => {
          const bc = { healthy: 'var(--healthy)', warning: 'var(--warning)', critical: 'var(--critical)' }[ch.risk]
          return (
            <div
              key={ch.id}
              className="channels-table-row"
              onClick={() => setSelected(ch)}
            >
              <span className="ch-name">{ch.name}</span>
              <span className="ch-cat">{ch.category}</span>
              <div className="ch-bar-cell">
                <div className="progress-bar" style={{ width: 80 }}>
                  <div className="progress-fill" style={{ width: `${ch.activity}%`, background: bc }} />
                </div>
                <span style={{ color: bc, fontWeight: 600, fontSize: 12 }}>{ch.activity}%</span>
              </div>
              <span style={{ color: ch.sentiment >= 70 ? 'var(--healthy)' : ch.sentiment >= 50 ? 'var(--warning)' : 'var(--critical)', fontWeight: 600, fontSize: 13 }}>
                {ch.sentiment}%
              </span>
              <span className="ch-msgs">{ch.messages24h}</span>
              <span className="ch-time">{ch.lastActive}</span>
              <span className={`badge badge-${ch.risk === 'healthy' ? 'healthy' : ch.risk === 'warning' ? 'warning' : 'critical'}`}>
                {ch.risk}
              </span>
            </div>
          )
        })}
      </div>

      {selected && <ChannelDetailPanel channel={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
