import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Overview from './pages/Overview'
import DeadZoneMap from './pages/DeadZoneMap'
import Channels from './pages/Channels'
import AISparks from './pages/AISparks'
import Members from './pages/Members'
import Alerts from './pages/Alerts'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
        <div className="main-area">
          <TopBar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/dead-zones" element={<DeadZoneMap />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/sparks" element={<AISparks />} />
              <Route path="/members" element={<Members />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
