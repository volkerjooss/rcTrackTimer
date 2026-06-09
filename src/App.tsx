import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useSchedule } from './storage'
import MainView from './components/MainView'
import SetupView from './components/SetupView'
import InfoView from './components/InfoView'

export default function App() {
  const { schedule, update } = useSchedule()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">RC Track Timer</h1>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Timer
          </NavLink>
          <NavLink to="/setup" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Setup
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Info
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<MainView schedule={schedule} />} />
          <Route path="/setup" element={<SetupView schedule={schedule} update={update} />} />
          <Route path="/info" element={<InfoView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
