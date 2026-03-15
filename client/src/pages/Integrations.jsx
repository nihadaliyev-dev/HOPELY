import { useState } from 'react'
import { MessageCircle, Hash, Send, Check, X, Plus, Settings2, Wifi, WifiOff } from 'lucide-react'
import { integrations } from '../data/mockData'
import './Integrations.css'

const iconMap = { 'message-circle': MessageCircle, hash: Hash, send: Send }

export default function Integrations() {
  const [list, setList] = useState(integrations)
  const [connecting, setConnecting] = useState(null)

  const toggle = (id) => {
    const item = list.find(i => i.id === id)
    if (item.connected) {
      setList(l => l.map(i => i.id === id ? { ...i, connected: false, channels: 0, members: 0 } : i))
    } else {
      setConnecting(id)
      setTimeout(() => {
        setList(l => l.map(i => i.id === id ? { ...i, connected: true, channels: 5, members: 820 } : i))
        setConnecting(null)
      }, 1500)
    }
  }

  return (
    <div className="integrations-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Integrations</h1>
          <p>Connect your community platforms to start monitoring</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Plus size={13} /> Request Integration</button>
      </div>

      <div className="integrations-grid">
        {list.map(intg => {
          const Icon = iconMap[intg.icon] || MessageCircle
          const isConnecting = connecting === intg.id
          return (
            <div key={intg.id} className={`intg-card card card-glow ${intg.connected ? 'intg-card--connected' : ''}`}>
              <div className="intg-header">
                <div className="intg-icon" style={{ background: intg.color + '22', borderColor: intg.color + '44' }}>
                  <Icon size={22} style={{ color: intg.color }} />
                </div>
                <div className="intg-info">
                  <h3 className="intg-name">{intg.name}</h3>
                  <span className={`badge ${intg.connected ? 'badge-healthy' : 'badge-info'}`}>
                    {isConnecting ? 'Connecting...' : intg.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                {intg.connected ? <WifiOff size={16} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} /> : <Wifi size={16} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />}
              </div>

              {intg.connected ? (
                <div className="intg-stats">
                  <div className="intg-stat">
                    <span className="intg-stat-val">{intg.channels}</span>
                    <span className="intg-stat-key">Channels</span>
                  </div>
                  <div className="intg-stat">
                    <span className="intg-stat-val">{intg.members.toLocaleString()}</span>
                    <span className="intg-stat-key">Members</span>
                  </div>
                  <div className="intg-stat">
                    <span className="intg-stat-val" style={{ color: 'var(--healthy)' }}>Active</span>
                    <span className="intg-stat-key">Sync Status</span>
                  </div>
                </div>
              ) : (
                <p className="intg-desc">Connect your {intg.name} workspace to start AI-powered community monitoring.</p>
              )}

              <div className="intg-actions">
                {intg.connected ? (
                  <>
                    <button className="btn btn-secondary btn-sm"><Settings2 size={12} /> Configure</button>
                    <button className="btn btn-danger btn-sm" onClick={() => toggle(intg.id)}>
                      <X size={12} /> Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => toggle(intg.id)}
                    disabled={isConnecting}
                    style={{ justifyContent: 'center', flex: 1, opacity: isConnecting ? 0.7 : 1 }}
                  >
                    {isConnecting ? 'Connecting...' : (
                      <><Plus size={12} /> Connect {intg.name}</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming soon */}
      <div className="intg-coming-soon card">
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>More integrations coming soon</h3>
        <div className="intg-coming-chips">
          {['Reddit', 'WhatsApp', 'Twitter/X', 'GitHub Discussions', 'Discourse', 'Circle.so'].map(p => (
            <span key={p} className="intg-chip">{p}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
