import { useState } from 'react'
import { Bell, Brain, Clock, Shield, AlertTriangle, Save } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const [settings, setSettings] = useState({
    inactivityThreshold: '48',
    sentimentTracking: true,
    aiSparks: true,
    expertDetection: true,
    deadZoneAlerts: true,
    emailNotifications: true,
    slackNotifications: false,
    weeklyReport: true,
    publicHealthScore: false,
  })

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }))
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure AI monitoring, thresholds, and notifications</p>
      </div>

      {/* AI Features */}
      <SettingsSection title="AI Features" icon={Brain} description="Control which AI capabilities are active for your community">
        <ToggleSetting
          label="AI Discussion Spark Generator"
          description="Generate AI-crafted prompts to revive inactive channels"
          active={settings.aiSparks}
          onToggle={() => toggle('aiSparks')}
        />
        <ToggleSetting
          label="Sentiment Analysis"
          description="Track emotional tone across all channels in real-time"
          active={settings.sentimentTracking}
          onToggle={() => toggle('sentimentTracking')}
        />
        <ToggleSetting
          label="Expert Member Detection"
          description="Automatically tag domain experts and flag their disengagement"
          active={settings.expertDetection}
          onToggle={() => toggle('expertDetection')}
        />
        <ToggleSetting
          label="Dead Zone Prediction"
          description="AI predicts which channels are likely to go inactive in 7 days"
          active={settings.deadZoneAlerts}
          onToggle={() => toggle('deadZoneAlerts')}
        />
      </SettingsSection>

      {/* Thresholds */}
      <SettingsSection title="Inactivity Thresholds" icon={Clock} description="Configure when channels are flagged as inactive or dead">
        <div className="settings-field">
          <div>
            <div className="settings-field-label">Inactivity Warning Threshold</div>
            <div className="settings-field-desc">Flag a channel as "Warning" after this many hours of inactivity</div>
          </div>
          <select
            className="select"
            value={settings.inactivityThreshold}
            onChange={e => setSettings(s => ({ ...s, inactivityThreshold: e.target.value }))}
          >
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
            <option value="168">7 days</option>
          </select>
        </div>
        <div className="settings-field">
          <div>
            <div className="settings-field-label">Critical / Dead Zone Threshold</div>
            <div className="settings-field-desc">Channels flagged "Critical" after 2× the warning threshold</div>
          </div>
          <span className="settings-computed">
            {settings.inactivityThreshold * 2}h (auto)
          </span>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" icon={Bell} description="Choose how you receive community health alerts">
        <ToggleSetting
          label="Email Alerts"
          description="Receive critical alerts via email"
          active={settings.emailNotifications}
          onToggle={() => toggle('emailNotifications')}
        />
        <ToggleSetting
          label="Slack DM Notifications"
          description="Send alerts to your Slack personal inbox"
          active={settings.slackNotifications}
          onToggle={() => toggle('slackNotifications')}
        />
        <ToggleSetting
          label="Weekly Health Report"
          description="Get a curated Sunday digest of community health trends"
          active={settings.weeklyReport}
          onToggle={() => toggle('weeklyReport')}
        />
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title="Privacy & Sharing" icon={Shield} description="Manage what data is visible externally">
        <ToggleSetting
          label="Public Health Score Badge"
          description="Allow embedding a community health badge on your website"
          active={settings.publicHealthScore}
          onToggle={() => toggle('publicHealthScore')}
        />
      </SettingsSection>

      {/* Save button */}
      <div className="settings-save-row">
        {saved && (
          <span className="settings-saved-msg badge badge-healthy">✓ Settings saved</span>
        )}
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={13} /> Save Changes
        </button>
      </div>
    </div>
  )
}

function SettingsSection({ title, icon: Icon, description, children }) {
  return (
    <div className="settings-section card">
      <div className="settings-section-header">
        <div className="settings-section-icon">
          <Icon size={16} />
        </div>
        <div>
          <h2 className="settings-section-title">{title}</h2>
          <p className="settings-section-desc">{description}</p>
        </div>
      </div>
      <div className="settings-items">{children}</div>
    </div>
  )
}

function ToggleSetting({ label, description, active, onToggle }) {
  return (
    <div className="settings-toggle-row">
      <div>
        <div className="settings-field-label">{label}</div>
        <div className="settings-field-desc">{description}</div>
      </div>
      <div className={`toggle ${active ? 'active' : ''}`} onClick={onToggle} />
    </div>
  )
}
