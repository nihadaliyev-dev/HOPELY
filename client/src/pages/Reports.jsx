import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Mail, FileOutput, CheckCircle2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { useCommunity } from '../context/CommunityContext'
import { dashboardService } from '../services/dashboardService'
import './Reports.css'

export default function Reports() {
  const { activeCommunity } = useCommunity()
  const [reportsList, setReportsList] = useState([])
  const [loading, setLoading] = useState(true)

  const [generating, setGenerating] = useState(false)
  const [success, setSuccess] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (!activeCommunity) return
    let isMounted = true
    setLoading(true)

    dashboardService.getReports(activeCommunity.id)
      .then(data => {
        if (isMounted) setReportsList(data)
      })
      .catch(err => {
        console.error(err)
        if (isMounted) addToast({ type: 'error', message: 'Failed to load reports' })
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [activeCommunity, addToast])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setSuccess(true)
      addToast({ type: 'success', message: 'Report generated successfully.' })
      
      // Mock appending to the history list
      const newReport = { 
        id: Date.now(), 
        name: 'Comprehensive Health Digest', 
        date: 'Just now', 
        size: '1.2 MB', 
        type: 'PDF' 
      }
      setReportsList(prev => [newReport, ...prev])

      setTimeout(() => setSuccess(false), 3000)
    }, 2500)
  }

  return (
    <div className="reports-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Custom Reports</h1>
          <p>Generate, schedule, and export community health data</p>
        </div>
      </div>

      <div className="reports-layout">
        <div className="reports-left">
          <div className="card report-builder">
            <div className="report-builder-header">
              <h3>Generate New Report</h3>
            </div>
            
            <div className="report-form">
              <div className="form-group">
                <label>Report Type</label>
                <select className="input">
                  <option>Comprehensive Health Digest</option>
                  <option>Channel Inactivity Audit</option>
                  <option>Sentiment & Tone Analysis</option>
                  <option>At-Risk Member List</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date Range</label>
                  <select className="input">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Format</label>
                  <select className="input">
                    <option>PDF Document</option>
                    <option>CSV Export</option>
                    <option>JSON Data</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Include Sections</label>
                <div className="checkbox-grid">
                  <label className="checkbox-label"><input type="checkbox" defaultChecked /> Executive Summary</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked /> Channel Metrics</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked /> Sentiment Trends</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked /> Member Activity</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked /> AI Interventions</label>
                  <label className="checkbox-label"><input type="checkbox" /> Raw Message Logs</label>
                </div>
              </div>

              <div className="report-actions">
                <button className="btn btn-secondary"><Calendar size={14} /> Schedule Weekly</button>
                <button 
                  className={`btn btn-primary ${success ? 'btn-success' : ''}`}
                  onClick={handleGenerate}
                  disabled={generating || success}
                >
                  {generating ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating...</>
                  ) : success ? (
                    <><CheckCircle2 size={14} /> Ready to Download</>
                  ) : (
                    <><FileOutput size={14} /> Generate Report</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="reports-right">
          <div className="card past-reports">
            <h3 className="card-title">Past Reports</h3>
            <div className="past-reports-list">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-brand" size={20} />
                </div>
              ) : (
                reportsList.map(report => (
                  <div key={report.id} className="past-report-item">
                    <div className="pr-icon">
                      <FileText size={16} />
                    </div>
                    <div className="pr-info">
                      <div className="pr-name">{report.name}</div>
                      <div className="pr-meta">{report.date} • {report.size} • {report.type}</div>
                    </div>
                    <button className="btn-icon"><Download size={14} /></button>
                  </div>
                ))
              )}
            </div>
            
            <button className="btn btn-secondary w-full" style={{ marginTop: 16 }}>
              View All History
            </button>
          </div>

          <div className="card schedule-panel card-glow">
            <h3 className="card-title">Active Schedules</h3>
            <div className="schedule-item">
              <Mail size={16} className="schedule-icon" />
              <div>
                <div className="schedule-name">Weekly Health Digest (PDF)</div>
                <div className="schedule-meta">Every Monday at 9:00 AM • To: admin, team</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
