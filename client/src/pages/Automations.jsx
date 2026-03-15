import { useState } from 'react'
import { Plus, Zap, AlertTriangle, MessageSquare, Play, Pause, MoreVertical, Search, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import './Automations.css'

const initialRules = [
  {
    id: 1,
    name: 'Critical Dead Zone Alert',
    ifMetric: 'Channel Inactivity',
    condition: '> 48 hours',
    action: 'Send Slack DM to @admin',
    status: 'active',
    lastRun: '2 hours ago',
    runs: 142
  },
  {
    id: 2,
    name: 'Sentiment Drop Warning',
    ifMetric: 'Channel Sentiment',
    condition: '< 40%',
    action: 'Post "What\'s on your mind?" Spark',
    status: 'active',
    lastRun: '1 day ago',
    runs: 28
  },
  {
    id: 3,
    name: 'Expert Disengagement',
    ifMetric: 'Member (Expert) Activity',
    condition: '0 msgs in 7 days',
    action: 'Tag in #core-contributors',
    status: 'paused',
    lastRun: 'Never',
    runs: 0
  }
]

export default function Automations() {
  const [rules, setRules] = useState(initialRules)
  const [isCreating, setIsCreating] = useState(false)

  const toggleStatus = (id) => {
    setRules(r => r.map(rule => 
      rule.id === id 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ))
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
            <button className="btn btn-primary" onClick={() => setIsCreating(false)}><Check size={14} /> Save & Activate</button>
          </div>
        </motion.div>
      )}

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
    </div>
  )
}
