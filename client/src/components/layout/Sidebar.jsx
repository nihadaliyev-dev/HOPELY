import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Map, MessagesSquare, Sparkles,
  Users, BellRing, Workflow, FileBarChart, Plug, Settings, ChevronLeft, ChevronRight,
  Zap, Check
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { label: 'Overview',      icon: LayoutDashboard, path: '/overview' },
  { label: 'Dead Zone Map', icon: Map,              path: '/dead-zones' },
  { label: 'Channels',      icon: MessagesSquare,   path: '/channels' },
  { label: 'AI Sparks',     icon: Sparkles,         path: '/sparks' },
  { label: 'Members',       icon: Users,            path: '/members' },
  { label: 'Alerts',        icon: BellRing,         path: '/alerts' },
]

const actionItems = [
  { label: 'Automations',   icon: Workflow,         path: '/automations' },
  { label: 'Reports',       icon: FileBarChart,     path: '/reports' },
]

const bottomItems = [
  { label: 'Integrations', icon: Plug,     path: '/integrations' },
  { label: 'Settings',     icon: Settings, path: '/settings' },
]


export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={18} className="logo-zap" />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="logo-name">PulseCheck</span>
            <span className="logo-tag">AI</span>
          </div>
        )}
        <button className="sidebar-collapse-btn" onClick={onToggle} title="Toggle sidebar">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Status Banner */}
      {!collapsed && (
        <div className="sidebar-status">
          <span className="status-dot status-dot-healthy" />
          <span className="sidebar-status-text">Community: Moderate Risk</span>
        </div>
      )}

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{!collapsed && 'MONITOR'}</div>
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="sidebar-item-icon" />
            {!collapsed && <span>{label}</span>}
            {path === '/alerts' && !collapsed && (
              <span className="sidebar-badge">6</span>
            )}
            {path === '/sparks' && !collapsed && (
              <span className="sidebar-badge sidebar-badge--brand">3</span>
            )}
          </NavLink>
        ))}

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">{!collapsed && 'ACTION CENTER'}</div>
        {actionItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="sidebar-item-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">{!collapsed && 'MANAGE'}</div>
        {bottomItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="sidebar-item-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">CM</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-role">Community Manager</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
