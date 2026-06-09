import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import type { Schedule } from '../types'
import { useNow } from '../useNow'
import { beep } from '../sound'
import { useI18n } from '../i18n'
import {
  buildTimeline,
  formatClock,
  formatDuration,
  getActiveState,
} from '../schedule'

interface Props {
  schedule: Schedule
}

export default function MainView({ schedule }: Props) {
  const { t } = useI18n()
  const now = useNow(1000)
  const slots = buildTimeline(schedule, now)
  const { current, upcoming, remainingMs, beforeStart, finished } = getActiveState(slots, now)

  // Beep once when the active class changes (only after the first observed slot).
  const lastSlotStart = useRef<number | null>(null)
  useEffect(() => {
    const start = current ? current.start : null
    if (start !== lastSlotStart.current) {
      const isFirstObservation = lastSlotStart.current === null
      lastSlotStart.current = start
      if (!isFirstObservation && start !== null && schedule.beepEnabled) {
        beep(schedule.beepDurationSec * 1000)
      }
    }
  }, [current, schedule.beepEnabled])

  if (schedule.entries.length === 0) {
    return (
      <section className="main empty-state">
        <p>{t('main.noSchedule')}</p>
        <Link className="btn primary" to="/setup">
          {t('main.goToSetup')}
        </Link>
      </section>
    )
  }

  return (
    <section className="main">
      {current ? (
        <div className="current-card" style={{ backgroundColor: current.entry.color }}>
          <span className="current-label">{t('main.currentClass')}</span>
          <h2 className="current-name">{current.entry.className}</h2>
          <div className="current-countdown">{formatDuration(remainingMs)}</div>
          <span className="current-window">
            {formatClock(current.start)} – {formatClock(current.end)}
          </span>
        </div>
      ) : (
        <div className="current-card idle">
          <h2 className="current-name">
            {beforeStart
              ? t('main.notStarted')
              : finished
                ? t('main.finished')
                : t('main.noActive')}
          </h2>
          {beforeStart && slots.length > 0 && (
            <div className="current-countdown">
              {t('main.starts', { time: formatClock(slots[0].start) })}
            </div>
          )}
        </div>
      )}

      <div className="upcoming">
        <h3 className="upcoming-title">{t('main.upNext')}</h3>
        {upcoming.length === 0 ? (
          <p className="empty">{t('main.nothingNext')}</p>
        ) : (
          <ul className="upcoming-list">
            {upcoming.map((slot) => (
              <li
                key={`${slot.round}-${slot.entry.id}`}
                className="upcoming-item"
                style={{ borderLeftColor: slot.entry.color }}
              >
                <span className="upcoming-dot" style={{ backgroundColor: slot.entry.color }} />
                <span className="upcoming-name">{slot.entry.className}</span>
                <span className="upcoming-time">{formatClock(slot.start)}</span>
                <span className="upcoming-dur">{t('main.minShort', { n: slot.entry.durationMin })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
