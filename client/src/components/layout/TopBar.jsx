import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown, Clock, RefreshCw, LogOut, Settings as SettingsIcon, User, Menu } from 'lucide-react'
import { useCommunity } from '../../context/CommunityContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
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

export default function TopBar({ onMenuClick }) {
  const location = useLocation()
  const { communities, activeCommunity, setActiveCommunity } = useCommunity()
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  
  const [timeRange, setTimeRange] = useState('7d')
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const communityRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (communityRef.current && !communityRef.current.contains(event.target)) {
        setCommunityDropdownOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageLabel = routeLabels[location.pathname] || 'Dashboard'

  return (
    <header className="topbar">
      {/* Left: Community Switcher (moved from Sidebar) */}
      <div className="topbar-left">
        <button className="topbar-mobile-menu" onClick={onMenuClick}>
          <Menu size={18} />
        </button>
        <div className="topbar-breadcrumb">
          <span className="topbar-page">{pageLabel}</span>
        </div>
        <div className="topbar-sep"></div>

        <div className="topbar-community" ref={communityRef}>
          <button 
            className="topbar-community-btn"
            onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
          >
            <div className="topbar-community-icon">{activeCommunity.icon}</div>
            <span className="topbar-community-name">{activeCommunity.name}</span>
            <ChevronDown size={14} className="topbar-community-chevron" />
          </button>

          {communityDropdownOpen && (
            <div className="topbar-dropdown community-dropdown-menu">
              <div className="topbar-dropdown-header">Switch Community</div>
              {communities.map(c => (
                <button 
                  key={c.id}
                  className={`topbar-dropdown-item ${activeCommunity.id === c.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCommunity(c)
                    setCommunityDropdownOpen(false)
                  }}
                >
                  <div className="topbar-dropdown-icon">{c.icon}</div>
                  <div className="topbar-dropdown-info">
                    <span className="name">{c.name}</span>
                    <span className="platform">{c.platform}</span>
                  </div>
                </button>
              ))}
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-action">
                + Connect new community
              </button>
            </div>
          )}
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
        <button 
          className="topbar-icon-btn" 
          title="Refresh data"
          onClick={() => {
            if (isRefreshing) return;
            setIsRefreshing(true)
            setTimeout(() => {
              setIsRefreshing(false)
              addToast({ type: 'success', message: 'Dashboard data synced with community servers.' })
            }, 1000)
          }}
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
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

        <div className="topbar-sep" style={{ margin: '0 8px' }}></div>

        {/* Profile Dropdown */}
        <div className="topbar-profile" ref={profileRef}>
          <button 
            className="topbar-profile-btn"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="topbar-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="topbar-dropdown profile-dropdown-menu">
              <div className="topbar-dropdown-user-info">
                <div className="topbar-avatar lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="info">
                  <span className="name">User Name</span>
                  <span className="email">{user?.email || 'user@company.com'}</span>
                </div>
              </div>
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-item hoverable">
                <User size={14} className="dropdown-item-icon" />
                Profile Settings
              </button>
              <button className="topbar-dropdown-item hoverable">
                <SettingsIcon size={14} className="dropdown-item-icon" />
                Workspace Settings
              </button>
              <div className="topbar-dropdown-divider" />
              <button 
                className="topbar-dropdown-item hoverable danger"
                onClick={() => {
                  setProfileDropdownOpen(false)
                  logout()
                }}
              >
                <LogOut size={14} className="dropdown-item-icon" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
