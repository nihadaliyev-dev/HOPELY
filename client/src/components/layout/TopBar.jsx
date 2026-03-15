import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown, Clock, RefreshCw } from 'lucide-react'
import './TopBar.css'

const routeLabels = {
  '/overview': 'Overview',
  '/dead-zones': 'Dead Zone Map',
  '/channels': 'Channels',
  '/sparks': 'AI Sparks',
  '/members': 'Members',
  '/alerts': 'Alerts & Insights',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
}

export default function TopBar() {
  const location = useLocation()
  const [timeRange, setTimeRange] = useState('7d')
  const pageLabel = routeLabels[location.pathname] || 'PulseCheck AI'

  return (
    <header className="topbar">
      {/* Left: breadcrumb */}
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span className="topbar-product">PulseCheck AI</span>
          <span className="topbar-sep">/</span>
          <span className="topbar-page">{pageLabel}</span>
        </div>
      </div>

      {/* Center: search */}
      <div className="topbar-center">
        <div className="topbar-search">
          <Search size={14} className="search-icon" />
          <input type="text" placeholder="Search channels, members, alerts..." className="topbar-input" />
          <kbd className="topbar-kbd">⌘K</kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="topbar-right">
        {/* Time range picker */}
        <div className="topbar-timerange">
          <Clock size={13} />
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="topbar-select"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <ChevronDown size={12} />
        </div>

        {/* Refresh */}
        <button className="topbar-icon-btn" title="Refresh data">
          <RefreshCw size={15} />
        </button>

        {/* Alerts bell */}
        <div className="topbar-bell-wrapper">
          <button className="topbar-icon-btn" title="Alerts">
            <Bell size={15} />
          </button>
          <span className="topbar-notif-dot" />
        </div>

        {/* Live indicator */}
        <div className="topbar-live">
          <span className="live-dot" />
          <span>Live</span>
        </div>
      </div>
    </header>
  )
}
