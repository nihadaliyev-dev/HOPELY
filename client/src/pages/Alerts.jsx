import { useState } from 'react'
import { Flame, Shield, TrendingDown, Users, Activity, UserPlus, ArrowRight, Loader2 } from 'lucide-react'
import { alerts } from '../data/mockData'
import { useToast } from '../context/ToastContext'
import './Alerts.css'

const iconMap = {
  flame: Flame,
  shield: Shield,
  'trending-down': TrendingDown,
  users: Users,
  activity: Activity,
  'user-plus': UserPlus,
}

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

export default function Alerts() {
  const [filter, setFilter] = useState('All')
  const [dismissed, setDismissed] = useState([])
  const [actingOn, setActingOn] = useState(null)
  const { addToast } = useToast()

  const filtered = alerts
    .filter(a => !dismissed.includes(a.id))
    .filter(a => filter === 'All' || a.priority === filter.toLowerCase())
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))

  const handleAction = (alert) => {
    setActingOn(alert.id)
    setTimeout(() => {
      setActingOn(null)
      addToast({ type: 'success', message: `Action "${alert.action}" initiated in ${alert.channel}.` })
    }, 1200)
  }

  const handleDismiss = (id) => {
    setDismissed(d => [...d, id])
    addToast({ type: 'info', message: 'Alert dismissed.' })
  }

  return (
    <div className="alerts-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Alerts & Insights</h1>
          <p>Real-time risk detection and community intervention signals</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm">Mark all read</button>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="alerts-filter-row">
        {['All', 'Critical', 'High', 'Medium'].map(p => {
          const lower = p.toLowerCase()
          const count = p === 'All' ? filtered.length : alerts.filter(a => a.priority === lower && !dismissed.includes(a.id)).length
          return (
            <button
              key={p}
              className={`alerts-filter-btn ${filter === p ? 'active' : ''} alerts-filter-btn--${lower}`}
              onClick={() => setFilter(p)}
            >
              {p}
              <span className="alerts-filter-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Alert Cards */}
      <div className="alerts-list">
        {filtered.map(alert => {
          const Icon = iconMap[alert.icon] || Activity
          return (
            <div key={alert.id} className={`alert-card card alert-card--${alert.priority}`}>
              <div className={`alert-icon-wrap alert-icon-wrap--${alert.priority}`}>
                <Icon size={16} />
              </div>
              <div className="alert-body">
                <div className="alert-top">
                  <span className={`badge badge-${alert.priority === 'critical' || alert.priority === 'high' ? 'critical' : 'warning'}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className="badge badge-brand">{alert.channel}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <h3 className="alert-message">{alert.message}</h3>
                <p className="alert-detail">{alert.detail}</p>
                <div className="alert-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAction(alert)}
                    disabled={actingOn === alert.id}
                  >
                    {actingOn === alert.id ? <Loader2 size={11} className="animate-spin" /> : alert.action}
                    {actingOn !== alert.id && <ArrowRight size={11} />}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDismiss(alert.id)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="alerts-empty">
            <Shield size={36} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
            <p>No alerts for this filter. Community is looking clean!</p>
          </div>
        )}
      </div>
    </div>
  )
}
