import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Brain, AlertTriangle, CheckCircle, Loader2, Sparkles, Zap, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import MetricCard from '../components/ui/MetricCard'
import ChannelDetailPanel from '../components/ui/ChannelDetailPanel'
import { useToast } from '../context/ToastContext'
import { useCommunity } from '../context/CommunityContext'
import { dashboardService } from '../services/dashboardService'
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function Overview() {
  const { activeCommunity, analyzeServer, isAnalyzing, analysisResult } = useCommunity()
  const [selectedChannel, setSelectedChannel] = useState(null)
  
  // Data states
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [diagnosis, setDiagnosis] = useState(null)
  const [alertsList, setAlertsList] = useState([])
  const [criticalChannels, setCriticalChannels] = useState([])

  // Interactive mock states
  const { addToast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [loadingAlertId, setLoadingAlertId] = useState(null)

  useEffect(() => {
    if (!activeCommunity) return
    let isMounted = true
    setLoading(true)

    Promise.all([
      dashboardService.getOverviewStats(activeCommunity.id),
      dashboardService.getTimeline(activeCommunity.id, '7d'),
      dashboardService.getAiDiagnosis(activeCommunity.id),
      dashboardService.getAlerts(activeCommunity.id),
      dashboardService.getChannels(activeCommunity.id)
    ]).then(([statsData, timelineData, diagnosisData, alertsData, channelsData]) => {
      if (!isMounted) return
      setStats(statsData)
      setTimeline(timelineData)
      setDiagnosis(diagnosisData)
      setAlertsList(alertsData.filter(a => a.priority === 'critical').slice(0, 3))
      setCriticalChannels(channelsData.filter(c => c.risk === 'critical'))
    }).catch(err => {
      console.error(err)
      if (isMounted) addToast({ type: 'error', message: 'Failed to load dashboard data' })
    }).finally(() => {
      if (isMounted) setLoading(false)
    })

    return () => { isMounted = false }
  }, [activeCommunity, addToast])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      addToast({ type: 'success', message: 'Report generated and downloaded successfully.' })
    }, 1500)
  }

  const handleDiagnosis = async () => {
    if (!activeCommunity) return
    try {
      await analyzeServer(activeCommunity.id)
      addToast({ type: 'success', message: 'AI Analysis complete! Gemini insights ready.' })
    } catch (err) {
      addToast({ type: 'error', message: 'AI Analysis failed. Please try again.' })
    }
  }

  const handleAlertAction = (alert) => {
    setLoadingAlertId(alert.id)
    setTimeout(() => {
      setLoadingAlertId(null)
      addToast({ type: 'success', message: `Action "${alert.action}" executed successfully.` })
    }, 1000)
  }

  if (loading || !stats || !diagnosis) {
    return (
      <div className="flex items-center justify-center h-full w-full" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--brand-primary)' }} />
      </div>
    )
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
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 size={13} className="animate-spin" /> : <Brain size={13} />}
            {isAnalyzing ? 'Analyzing...' : analysisResult ? 'Re-Analyze' : 'Run AI Analysis'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <motion.div 
        className="overview-metrics"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Health Score"
            value={stats.healthScore}
            unit="/100"
            change={stats.weeklyChange.healthScore}
            highlight
            color="brand"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Active Channels"
            value={stats.activeChannels}
            change={stats.weeklyChange.activeChannels}
            color="healthy"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Dying Channels"
            value={stats.dyingChannels}
            change={stats.weeklyChange.dyingChannels}
            invertTrend
            color="critical"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Avg Discussion Depth"
            value={stats.avgDiscussionDepth}
            unit=" msgs"
            color="info"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Sentiment Score"
            value={stats.sentimentScore}
            unit="%"
            change={stats.weeklyChange.sentimentScore}
            invertTrend
            color="warning"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="AI Interventions"
            value={stats.aiInterventionCount}
            unit=" this week"
            color="brand"
          />
        </motion.div>
      </motion.div>

      {/* Main Content: Chart + Diagnosis */}
      <motion.div 
        className="overview-main"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
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
              <AreaChart data={timeline}>
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

        {/* AI Analysis Panel */}
        <div className="card card-accent-top overview-diagnosis">
          <div className="diagnosis-header">
            <div className="diagnosis-icon">
              <Brain size={18} />
            </div>
            <div>
              <h2 className="overview-section-title">Gemini AI Analysis</h2>
              <p className="text-sm text-secondary">
                {analysisResult
                  ? `Analyzed ${new Date(analysisResult.analyzedAt).toLocaleTimeString()}`
                  : 'Click Run AI Analysis to get insights'}
              </p>
            </div>
            {analysisResult && (
              <div className="diagnosis-score-chip">
                <span className="diagnosis-score-val">{analysisResult.healthScore}</span>
                <span className="diagnosis-score-label">/ 100</span>
              </div>
            )}
          </div>

          {/* Idle / Loading state */}
          {!analysisResult && !isAnalyzing && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <Sparkles size={32} style={{ color: '#6366F1', opacity: 0.5, margin: '0 auto 0.75rem' }} />
              <p className="text-sm text-secondary" style={{ margin: 0 }}>
                Run an AI analysis to get health scores, dead zones, and actionable recommendations powered by Gemini 1.5 Flash.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <Loader2 size={28} className="animate-spin" style={{ color: '#6366F1', margin: '0 auto 0.75rem' }} />
              <p className="text-sm text-secondary" style={{ margin: 0 }}>Gemini is analyzing your server...</p>
            </div>
          )}

          {/* Results */}
          {analysisResult && !isAnalyzing && (
            <>
              {/* Summary */}
              <p className="diagnosis-text" style={{ marginTop: 8 }}>{analysisResult.summary}</p>

              {/* Scores row */}
              <div style={{ display: 'flex', gap: '0.75rem', margin: '0.75rem 0' }}>
                <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6366F1' }}>{analysisResult.healthScore}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Health Score</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10B981' }}>{analysisResult.sentimentScore}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sentiment</div>
                </div>
                {analysisResult.deadZones?.length > 0 && (
                  <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ef4444' }}>{analysisResult.deadZones.length}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dead Zones</div>
                  </div>
                )}
              </div>

              {/* Key Issues */}
              {analysisResult.keyIssues?.length > 0 && (
                <div className="diagnosis-items" style={{ marginBottom: 10 }}>
                  {analysisResult.keyIssues.slice(0, 2).map((issue, i) => (
                    <div key={i} className="diagnosis-item diagnosis-item--concern">
                      <ShieldAlert size={13} />
                      <div className="diagnosis-item-value">{issue}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Top Recommendation */}
              {analysisResult.recommendations?.[0] && (
                <div className="diagnosis-item diagnosis-item--quickwin" style={{ marginBottom: 12 }}>
                  <Zap size={13} />
                  <div>
                    <div className="diagnosis-item-label">Top Recommendation</div>
                    <div className="diagnosis-item-value">{analysisResult.recommendations[0].action}</div>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            className="btn btn-primary w-full"
            style={{ marginTop: 12, justifyContent: 'center' }}
            onClick={handleDiagnosis}
            disabled={isAnalyzing}
          >
            {isAnalyzing
              ? <><Loader2 size={13} className="animate-spin" /> Analyzing...</>
              : <><Brain size={13} /> {analysisResult ? 'Re-Analyze Server' : 'Run AI Analysis'}</>
            }
          </button>
        </div>
      </motion.div>

      {/* Risk Alerts + Critical Channels */}
      <motion.div 
        className="overview-bottom"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Top Risk Alerts */}
        <div className="card overview-alerts-card">
          <div className="flex items-center justify-between" style={{ padding: '18px 20px 14px' }}>
            <h2 className="overview-section-title">Top Risk Alerts</h2>
            <a href="/alerts" className="btn btn-ghost btn-sm text-accent">
              View all <ArrowRight size={12} />
            </a>
          </div>
          <div className="overview-alerts-list">
            {alertsList.map(alert => (
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
      </motion.div>

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
