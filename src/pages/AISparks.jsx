import { useState } from 'react'
import { Sparkles, Send, Calendar, Edit3, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react'
import { sparks } from '../data/mockData'
import './AISparks.css'

const statusConfig = {
  draft:     { label: 'Draft',     color: 'var(--text-muted)',   badge: 'badge-info' },
  approved:  { label: 'Approved',  color: 'var(--healthy)',      badge: 'badge-healthy' },
  scheduled: { label: 'Scheduled', color: 'var(--warning)',      badge: 'badge-warning' },
  posted:    { label: 'Posted',    color: 'var(--brand-primary)', badge: 'badge-brand' },
}

export default function AISparks() {
  const [sparkList, setSparkList] = useState(sparks)
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'draft', 'approved', 'scheduled']
  const filtered = activeFilter === 'All' ? sparkList : sparkList.filter(s => s.status === activeFilter)

  const updateStatus = (id, status) => {
    setSparkList(list => list.map(s => s.id === id ? { ...s, status } : s))
  }

  return (
    <div className="sparks-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>AI Spark Generator</h1>
          <p>AI-crafted discussion starters to revive engagement across dead zones</p>
        </div>
        <button className="btn btn-primary">
          <Zap size={13} /> Generate New Spark
        </button>
      </div>

      {/* Stats row */}
      <div className="sparks-stats">
        <div className="spark-stat card">
          <span className="spark-stat-val">{sparkList.length}</span>
          <span className="spark-stat-label">Total Sparks</span>
        </div>
        <div className="spark-stat card">
          <span className="spark-stat-val" style={{ color: 'var(--healthy)' }}>
            {sparkList.filter(s => s.status === 'approved').length}
          </span>
          <span className="spark-stat-label">Approved</span>
        </div>
        <div className="spark-stat card">
          <span className="spark-stat-val" style={{ color: 'var(--warning)' }}>
            {sparkList.filter(s => s.status === 'scheduled').length}
          </span>
          <span className="spark-stat-label">Scheduled</span>
        </div>
        <div className="spark-stat card">
          <span className="spark-stat-val" style={{ color: 'var(--brand-primary)' }}>
            {Math.round(sparkList.reduce((sum, s) => sum + s.predictedEngagement, 0) / sparkList.length)}%
          </span>
          <span className="spark-stat-label">Avg. Predicted Impact</span>
        </div>
      </div>

      {/* Filters */}
      <div className="sparks-filters">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f === 'All' ? 'All Sparks' : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {/* Spark Cards */}
      <div className="sparks-grid">
        {filtered.map(spark => (
          <SparkCard key={spark.id} spark={spark} onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  )
}

function SparkCard({ spark, onUpdateStatus }) {
  const sc = statusConfig[spark.status] || statusConfig.draft
  const engColor = spark.predictedEngagement >= 80 ? 'var(--healthy)' :
                   spark.predictedEngagement >= 60 ? 'var(--warning)' : 'var(--critical)'

  return (
    <div className="spark-card card card-glow">
      {/* Header */}
      <div className="spark-card-header">
        <div className="spark-card-meta">
          <span className="spark-category">{spark.category}</span>
          <span className={`badge ${sc.badge}`}>{sc.label}</span>
        </div>
        <div className="spark-engagement-badge" style={{ color: engColor, borderColor: engColor }}>
          <TrendingUp size={11} />
          <span>{spark.predictedEngagement}% impact</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="spark-title">{spark.title}</h3>

      {/* Question */}
      <div className="spark-question">
        <p>"{spark.question}"</p>
      </div>

      {/* Why it was recommended */}
      <div className="spark-reason">
        <Sparkles size={11} />
        <span>{spark.reason}</span>
      </div>

      {/* Target channel + members */}
      <div className="spark-targeting">
        <div className="spark-target-row">
          <span className="spark-target-label">Channel</span>
          <span className="spark-target-val badge badge-brand">{spark.targetChannel}</span>
        </div>
        <div className="spark-target-row">
          <span className="spark-target-label">Tag</span>
          <div className="spark-tags">
            {spark.tagMembers.map(m => (
              <span key={m} className="spark-member-tag">{m}</span>
            ))}
          </div>
        </div>
        {spark.scheduledFor && (
          <div className="spark-target-row">
            <span className="spark-target-label">Scheduled</span>
            <span className="spark-target-val" style={{ color: 'var(--warning)' }}>
              <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
              {spark.scheduledFor}
            </span>
          </div>
        )}
      </div>

      {/* Engagement bar */}
      <div className="spark-impact-row">
        <span className="spark-target-label">Predicted Engagement</span>
        <span style={{ color: engColor, fontWeight: 700, fontSize: 12 }}>{spark.predictedEngagement}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${spark.predictedEngagement}%`, background: engColor }} />
      </div>

      {/* Actions */}
      <div className="spark-actions">
        <button className="btn btn-secondary btn-sm">
          <Edit3 size={12} /> Edit
        </button>
        {spark.status === 'draft' && (
          <button className="btn btn-secondary btn-sm" onClick={() => onUpdateStatus(spark.id, 'approved')}>
            <CheckCircle size={12} /> Approve
          </button>
        )}
        {spark.status !== 'scheduled' && spark.status !== 'posted' && (
          <button className="btn btn-secondary btn-sm" onClick={() => onUpdateStatus(spark.id, 'scheduled')}>
            <Calendar size={12} /> Schedule
          </button>
        )}
        {spark.status === 'approved' && (
          <button className="btn btn-primary btn-sm" onClick={() => onUpdateStatus(spark.id, 'posted')}>
            <Send size={12} /> Post Now
          </button>
        )}
      </div>
    </div>
  )
}
