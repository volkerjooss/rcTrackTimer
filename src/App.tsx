import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useSchedule } from './storage'
import { LANGUAGES, useI18n } from './i18n'
import { installAudioUnlock } from './sound'
import MainView from './components/MainView'
import SetupView from './components/SetupView'
import InfoView from './components/InfoView'

export default function App() {
  const { schedule, update } = useSchedule()
  const { lang, setLang, t } = useI18n()

  // Unlock audio on the first user interaction so the timer-driven beep can
  // play on iOS Safari, which keeps the AudioContext suspended until a gesture.
  useEffect(() => {
    installAudioUnlock()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('app.title')}</h1>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.timer')}
          </NavLink>
          <NavLink to="/setup" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.setup')}
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.info')}
          </NavLink>
          <div className="lang-switch" role="group" aria-label={t('nav.language')}>
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                className={code === lang ? 'lang-btn active' : 'lang-btn'}
                aria-pressed={code === lang}
                onClick={() => setLang(code)}
              >
                {label}
              </button>
            ))}
          </div>
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
