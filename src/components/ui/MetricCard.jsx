import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import './MetricCard.css'

const colorMap = {
  brand: { text: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  healthy: { text: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  critical: { text: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  warning: { text: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  info: { text: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
}

export default function MetricCard({ label, value, unit = '', change, invertTrend, highlight, color = 'brand' }) {
  const c = colorMap[color] || colorMap.brand
  const isPositive = change > 0
  const isBad = invertTrend ? isPositive : !isPositive
  const trendColor = change === 0 || change === undefined ? 'var(--text-muted)'
    : isBad ? 'var(--critical)' : 'var(--healthy)'
  const TrendIcon = change === 0 || change === undefined ? Minus : isPositive ? TrendingUp : TrendingDown

  return (
    <div className={`metric-card card card-glow ${highlight ? 'metric-card--highlight' : ''}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value-row">
        <span className="metric-value" style={highlight ? { color: c.text } : {}}>
          {value}
        </span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="metric-trend" style={{ color: trendColor }}>
          <TrendIcon size={12} />
          <span>{change > 0 ? '+' : ''}{change} vs last week</span>
        </div>
      )}
      {/* Color accent bar */}
      <div className="metric-bar" style={{ background: c.bg }}>
        <div className="metric-bar-fill" style={{ background: c.text, width: `${Math.min(100, Math.abs(value))}%` }} />
      </div>
    </div>
  )
}
