import { useState, useEffect } from 'react'
import { Plus, Zap, AlertTriangle, MessageSquare, Play, Pause, MoreVertical, Search, Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { useCommunity } from '../context/CommunityContext'
import { dashboardService } from '../services/dashboardService'
import './Automations.css'

export default function Automations() {
  const { activeCommunity } = useCommunity()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  const [isCreating, setIsCreating] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (!activeCommunity) return
    let isMounted = true
    setLoading(true)

    dashboardService.getAutomations(activeCommunity.id)
      .then(data => {
        if (isMounted) setRules(data)
      })
      .catch(err => {
        console.error(err)
        if (isMounted) addToast({ type: 'error', message: 'Failed to load automations' })
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [activeCommunity, addToast])

  const toggleStatus = (id) => {
    setRules(r => r.map(rule => {
      if (rule.id === id) {
        const newStatus = rule.status === 'active' ? 'paused' : 'active'
        addToast({ 
          type: newStatus === 'active' ? 'success' : 'info', 
          message: `Automation "${rule.name}" is now ${newStatus}.` 
        })
        return { ...rule, status: newStatus }
      }
      return rule
    }))
  }

  const handleSaveRule = () => {
    setIsCreating(false)
    addToast({ type: 'success', message: 'New automation rule activated!' })
    // Mock adding rule to top of list
    const newRule = {
      id: Date.now(),
      name: 'Custom Alert Rule',
      ifMetric: 'Channel Inactivity',
      condition: '> 24 hours',
      action: 'Send Slack DM',
      status: 'active',
      lastRun: 'Never',
      runs: 0
    }
    setRules(prev => [newRule, ...prev])
  }

  return (
    <div className="automations-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Automations</h1>
          <p>Visual rule builder: If THIS happens, AI does THAT.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreating(!isCreating)}
        >
          <Plus size={14} /> New Rule
        </button>
      </div>

      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="automation-builder card card-glow"
        >
          <h3>Create New Automation</h3>
          <div className="builder-flow">
            <div className="builder-step">
              <span className="step-label">IF</span>
              <select className="input">
                <option>Channel Inactivity</option>
                <option>Channel Sentiment</option>
                <option>Member Activity</option>
                <option>New Member Joined</option>
              </select>
            </div>
            
            <div className="builder-step">
              <span className="step-label">IS</span>
              <select className="input">
                <option>&gt; 24 hours</option>
                <option>&gt; 48 hours</option>
                <option>&lt; 50%</option>
                <option>Drops by 20%</option>
              </select>
            </div>

            <div className="builder-arrow">→</div>

            <div className="builder-step builder-step-action">
              <span className="step-label step-label-brand">THEN</span>
              <select className="input">
                <option>Send Slack DM</option>
                <option>Post AI Spark to Channel</option>
                <option>Send Email Alert</option>
                <option>Apply "At Risk" Label</option>
              </select>
            </div>
          </div>
          <div className="builder-actions">
            <button className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveRule}><Check size={14} /> Save & Activate</button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-brand" size={24} />
        </div>
      ) : (
        <div className="rules-list">
          {rules.map(rule => (
            <div key={rule.id} className={`rule-card card ${rule.status === 'active' ? 'rule-active' : 'rule-paused'}`}>
              <div className="rule-header">
                <h3 className="rule-name">{rule.name}</h3>
                <div className="rule-toggles">
                  <button 
                    className={`btn btn-sm ${rule.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleStatus(rule.id)}
                  >
                    {rule.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
                  </button>
                  <button className="btn-icon"><MoreVertical size={16} /></button>
                </div>
              </div>

              <div className="rule-logic">
                <div className="logic-part logic-if">
                  <span className="logic-badge">IF</span>
                  <span className="logic-text">{rule.ifMetric} <strong>{rule.condition}</strong></span>
                </div>
                <div className="logic-arrow">→</div>
                <div className="logic-part logic-then">
                  <span className="logic-badge badge-brand">THEN</span>
                  <span className="logic-text">{rule.action}</span>
                </div>
              </div>

              <div className="rule-footer">
                <div className="rule-stat">
                  <span className="stat-dot" style={{ background: rule.status === 'active' ? 'var(--healthy)' : 'var(--text-muted)' }}></span>
                  {rule.status === 'active' ? 'Active' : 'Paused'}
                </div>
                <div className="rule-stat">Runs: {rule.runs}</div>
                <div className="rule-stat">Last run: {rule.lastRun}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
