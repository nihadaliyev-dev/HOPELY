import { useState } from 'react'
import { Filter, Search, Grid, List } from 'lucide-react'
import { channels } from '../data/mockData'
import ChannelDetailPanel from '../components/ui/ChannelDetailPanel'
import './DeadZoneMap.css'

const riskOrder = { critical: 0, warning: 1, healthy: 2 }
const categories = ['All', 'Tech', 'General', 'Business', 'Creative', 'Career']

export default function DeadZoneMap() {
  const [selected, setSelected] = useState(null)
  const [filterRisk, setFilterRisk] = useState('All')
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = channels
    .filter(c => filterRisk === 'All' || c.risk === filterRisk.toLowerCase())
    .filter(c => filterCat === 'All' || c.category === filterCat)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])

  const counts = {
    critical: channels.filter(c => c.risk === 'critical').length,
    warning: channels.filter(c => c.risk === 'warning').length,
    healthy: channels.filter(c => c.risk === 'healthy').length,
  }

  return (
    <div className="deadzone animate-fade-in">
      <div className="page-header">
        <h1>Dead Zone Map</h1>
        <p>Channel health visualization — identify dead zones before they become critical</p>
      </div>

      {/* Summary chips */}
      <div className="deadzone-summary">
        <div className="dz-chip dz-chip--critical" onClick={() => setFilterRisk('Critical')}>
          <span className="dz-chip-count">{counts.critical}</span>
          <span className="dz-chip-label">Critical</span>
        </div>
        <div className="dz-chip dz-chip--warning" onClick={() => setFilterRisk('Warning')}>
          <span className="dz-chip-count">{counts.warning}</span>
          <span className="dz-chip-label">Warning</span>
        </div>
        <div className="dz-chip dz-chip--healthy" onClick={() => setFilterRisk('All')}>
          <span className="dz-chip-count">{counts.healthy}</span>
          <span className="dz-chip-label">Healthy</span>
        </div>
        <div className="dz-chip">
          <span className="dz-chip-count">{channels.length}</span>
          <span className="dz-chip-label">Total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="deadzone-filters">
        <div className="dz-search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search channels..."
            className="input"
            style={{ paddingLeft: 32 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="dz-filter-group">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          {['All', 'Critical', 'Warning', 'Healthy'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`btn btn-sm ${filterRisk === r ? 'btn-primary' : 'btn-secondary'}`}
            >{r}</button>
          ))}
        </div>
        <div className="dz-filter-group">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="select">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="dz-view-toggle">
          <button
            className={`dz-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          ><Grid size={15} /></button>
          <button
            className={`dz-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          ><List size={15} /></button>
        </div>
      </div>

      {/* Channel Grid / List */}
      {viewMode === 'grid' ? (
        <div className="dz-grid">
          {filtered.map(ch => (
            <ChannelHeatCell key={ch.id} channel={ch} onClick={() => setSelected(ch)} />
          ))}
        </div>
      ) : (
        <div className="dz-list">
          {filtered.map(ch => (
            <ChannelListRow key={ch.id} channel={ch} onClick={() => setSelected(ch)} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="dz-empty">
          <p>No channels match your filters.</p>
        </div>
      )}

      {selected && <ChannelDetailPanel channel={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function ChannelHeatCell({ channel, onClick }) {
  const risk = channel.risk
  const riskClass = `dz-cell--${risk}`
  const barColor = { healthy: 'var(--healthy)', warning: 'var(--warning)', critical: 'var(--critical)' }[risk]

  return (
    <div className={`dz-cell card card-glow ${riskClass}`} onClick={onClick}>
      <div className="dz-cell-header">
        <span className="dz-cell-name">{channel.name}</span>
        <span className={`badge badge-${risk === 'healthy' ? 'healthy' : risk === 'warning' ? 'warning' : 'critical'}`}>
          {risk}
        </span>
      </div>
      <div className="dz-cell-category">{channel.category}</div>

      {/* Activity bar */}
      <div className="dz-cell-activity">
        <div className="dz-activity-label">
          <span>Activity</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{channel.activity}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${channel.activity}%`, background: barColor }} />
        </div>
      </div>

      <div className="dz-cell-meta">
        <span className="dz-cell-time">⏱ {channel.lastActive}</span>
        <span className="dz-cell-msgs">{channel.messages24h} msgs/24h</span>
      </div>

      <div className="dz-cell-engagement">
        <div className="dz-eng-row">
          <span>Engagement</span>
          <span style={{ color: barColor }}>{channel.engagement}%</span>
        </div>
        <div className="dz-heatmap-dots">
          {Array.from({ length: 14 }).map((_, i) => {
            const activity = channel.activity
            const dotActivity = Math.max(0, activity - Math.random() * 30)
            return (
              <div
                key={i}
                className="dz-heatmap-dot"
                style={{
                  background: dotActivity > 60 ? 'var(--healthy)' :
                               dotActivity > 30 ? 'var(--warning)' :
                               dotActivity > 0  ? 'var(--critical)' :
                               'var(--bg-subtle)',
                  opacity: 0.6 + dotActivity / 200
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChannelListRow({ channel, onClick }) {
  const risk = channel.risk
  const barColor = { healthy: 'var(--healthy)', warning: 'var(--warning)', critical: 'var(--critical)' }[risk]

  return (
    <div className={`dz-row card dz-row--${risk}`} onClick={onClick}>
      <div className={`status-dot status-dot-${risk === 'healthy' ? 'healthy' : risk === 'warning' ? 'warning' : 'critical'}`} />
      <div className="dz-row-name">
        <span className="dz-row-channel">{channel.name}</span>
        <span className="text-sm text-muted">{channel.category}</span>
      </div>
      <div className="dz-row-bar">
        <div className="progress-bar" style={{ width: 120 }}>
          <div className="progress-fill" style={{ width: `${channel.activity}%`, background: barColor }} />
        </div>
        <span style={{ color: barColor, fontSize: 13, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>
          {channel.activity}%
        </span>
      </div>
      <span className="dz-row-time">{channel.lastActive}</span>
      <span className="text-sm text-secondary">{channel.messages24h} msgs</span>
      <span className={`badge badge-${risk === 'healthy' ? 'healthy' : risk === 'warning' ? 'warning' : 'critical'}`}>
        {risk}
      </span>
    </div>
  )
}
