import { useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowRight, Brain, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  communityStats, pulseTimelineData, alerts as allAlerts, aiDiagnosis
} from '../data/mockData'
import MetricCard from '../components/ui/MetricCard'
import ChannelDetailPanel from '../components/ui/ChannelDetailPanel'
import { channels } from '../data/mockData'
import { useToast } from '../context/ToastContext'
import './Overview.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

const topAlerts = allAlerts.filter(a => a.priority === 'critical').slice(0, 3)

export default function Overview() {
  const [selectedChannel, setSelectedChannel] = useState(null)
  
  // Interactive mock states
  const { addToast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [loadingAlertId, setLoadingAlertId] = useState(null)

  const criticalChannels = channels.filter(c => c.risk === 'critical')

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      addToast({ type: 'success', message: 'Report generated and downloaded successfully.' })
    }, 1500)
  }

  const handleDiagnosis = () => {
    setIsDiagnosing(true)
    setTimeout(() => {
      setIsDiagnosing(false)
      addToast({ type: 'success', message: 'AI Diagnosis complete. Found 2 new insights.' })
    }, 2000)
  }

  const handleAlertAction = (alert) => {
    setLoadingAlertId(alert.id)
    setTimeout(() => {
      setLoadingAlertId(null)
      addToast({ type: 'success', message: `Action "${alert.action}" executed successfully.` })
    }, 1000)
  }

  return (
    <div className="overview animate-fade-in">
      {/* Header */}
      <div className="overview-header">
        <div>
          <h1 className="overview-title">Community Overview</h1>
          <p className="overview-subtitle">
            Real-time health monitoring across all connected platforms
          </p>
        </div>
        <div className="overview-header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : null}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleDiagnosis}
            disabled={isDiagnosing}
          >
            {isDiagnosing ? <Loader2 size={13} className="animate-spin" /> : <Brain size={13} />}
            {isDiagnosing ? 'Running...' : 'Run AI Diagnosis'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="overview-metrics">
        <MetricCard
          label="Health Score"
          value={communityStats.healthScore}
          unit="/100"
          change={communityStats.weeklyChange.healthScore}
          highlight
          color="brand"
        />
        <MetricCard
          label="Active Channels"
          value={communityStats.activeChannels}
          change={communityStats.weeklyChange.activeChannels}
          color="healthy"
        />
        <MetricCard
          label="Dying Channels"
          value={communityStats.dyingChannels}
          change={communityStats.weeklyChange.dyingChannels}
          invertTrend
          color="critical"
        />
        <MetricCard
          label="Avg Discussion Depth"
          value={communityStats.avgDiscussionDepth}
          unit=" msgs"
          color="info"
        />
        <MetricCard
          label="Sentiment Score"
          value={communityStats.sentimentScore}
          unit="%"
          change={communityStats.weeklyChange.sentimentScore}
          invertTrend
          color="warning"
        />
        <MetricCard
          label="AI Interventions"
          value={communityStats.aiInterventionCount}
          unit=" this week"
          color="brand"
        />
      </div>

      {/* Main Content: Chart + Diagnosis */}
      <div className="overview-main">
        {/* Pulse Timeline */}
        <div className="card card-glow overview-chart-card">
          <div className="flex items-center justify-between" style={{ padding: '20px 24px 0' }}>
            <div>
              <h2 className="overview-section-title">Community Pulse Timeline</h2>
              <p className="text-sm text-secondary">Activity, member engagement & sentiment over time</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item legend-messages">Messages</span>
              <span className="legend-item legend-members">Members</span>
              <span className="legend-item legend-sentiment">Sentiment</span>
            </div>
          </div>
          <div style={{ padding: '16px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={pulseTimelineData}>
                <defs>
                  <linearGradient id="gradMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="messages" name="Messages" stroke="#6366F1" strokeWidth={2} fill="url(#gradMessages)" />
                <Area type="monotone" dataKey="members" name="Members" stroke="#06B6D4" strokeWidth={2} fill="url(#gradMembers)" />
                <Area type="monotone" dataKey="sentiment" name="Sentiment %" stroke="#10B981" strokeWidth={2} fill="url(#gradSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Diagnosis */}
        <div className="card card-accent-top overview-diagnosis">
          <div className="diagnosis-header">
            <div className="diagnosis-icon">
              <Brain size={18} />
            </div>
            <div>
              <h2 className="overview-section-title">AI Diagnosis</h2>
              <p className="text-sm text-secondary">Updated 2 min ago</p>
            </div>
            <div className="diagnosis-score-chip">
              <span className="diagnosis-score-val">{aiDiagnosis.score}</span>
              <span className="diagnosis-score-label">/ 100</span>
            </div>
          </div>

          <div className="diagnosis-trend-row">
            <span className={`badge ${aiDiagnosis.trend === 'declining' ? 'badge-critical' : 'badge-healthy'}`}>
              {aiDiagnosis.trend === 'declining' ? (
                <TrendingDown size={10} />
              ) : (
                <TrendingUp size={10} />
              )}
              {aiDiagnosis.trend === 'declining' ? 'Declining' : 'Improving'}
            </span>
          </div>

          <p className="diagnosis-text">{aiDiagnosis.summary}</p>

          <div className="diagnosis-items">
            <div className="diagnosis-item diagnosis-item--concern">
              <AlertTriangle size={13} />
              <div>
                <div className="diagnosis-item-label">Top Concern</div>
                <div className="diagnosis-item-value">{aiDiagnosis.topConcern}</div>
              </div>
            </div>
            <div className="diagnosis-item diagnosis-item--quickwin">
              <CheckCircle size={13} />
              <div>
                <div className="diagnosis-item-label">Quick Win</div>
                <div className="diagnosis-item-value">{aiDiagnosis.quickWin}</div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-full" style={{ marginTop: 16, justifyContent: 'center' }}>
            View Full Analysis <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Risk Alerts + Critical Channels */}
      <div className="overview-bottom">
        {/* Top Risk Alerts */}
        <div className="card overview-alerts-card">
          <div className="flex items-center justify-between" style={{ padding: '18px 20px 14px' }}>
            <h2 className="overview-section-title">Top Risk Alerts</h2>
            <a href="/alerts" className="btn btn-ghost btn-sm text-accent">
              View all <ArrowRight size={12} />
            </a>
          </div>
          <div className="overview-alerts-list">
            {topAlerts.map(alert => (
              <div key={alert.id} className="overview-alert-row">
                <div className={`status-dot status-dot-${alert.priority === 'critical' ? 'critical' : 'warning'}`} />
                <div className="overview-alert-text">
                  <span className="overview-alert-channel">{alert.channel}</span>
                  <span className="overview-alert-msg">{alert.message}</span>
                </div>
                <span className="overview-alert-time">{alert.time}</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAlertAction(alert)}
                  disabled={loadingAlertId === alert.id}
                >
                  {loadingAlertId === alert.id ? <Loader2 size={13} className="animate-spin" /> : alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Critical channels */}
        <div className="card overview-critical-card">
          <div className="flex items-center justify-between" style={{ padding: '18px 20px 14px' }}>
            <h2 className="overview-section-title">Critical Channels</h2>
            <a href="/dead-zones" className="btn btn-ghost btn-sm text-accent">
              Dead Zone Map <ArrowRight size={12} />
            </a>
          </div>
          <div className="overview-critical-list">
            {criticalChannels.map(ch => (
              <div
                key={ch.id}
                className="overview-critical-row"
                onClick={() => setSelectedChannel(ch)}
              >
                <div className="critical-channel-info">
                  <span className="critical-channel-name">{ch.name}</span>
                  <span className="badge badge-critical">Critical</span>
                </div>
                <div className="critical-channel-meta">
                  <span className="text-sm text-muted">Last: {ch.lastActive}</span>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{
                      width: `${ch.activity}%`,
                      background: 'var(--critical)'
                    }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--critical)', fontWeight: 600 }}>
                    {ch.activity}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Detail Panel */}
      {selectedChannel && (
        <ChannelDetailPanel
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  )
}
