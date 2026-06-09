import { Link } from 'react-router-dom'
import type { Schedule } from '../types'
import { useNow } from '../useNow'
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
  const now = useNow(1000)
  const slots = buildTimeline(schedule, now)
  const { current, upcoming, remainingMs, beforeStart, finished } = getActiveState(slots, now)

  if (schedule.entries.length === 0) {
    return (
      <section className="main empty-state">
        <p>No schedule configured yet.</p>
        <Link className="btn primary" to="/setup">
          Go to Setup
        </Link>
      </section>
    )
  }

  return (
    <section className="main">
      {current ? (
        <div className="current-card" style={{ backgroundColor: current.entry.color }}>
          <span className="current-label">Current class</span>
          <h2 className="current-name">{current.entry.className}</h2>
          <div className="current-countdown">{formatDuration(remainingMs)}</div>
          <span className="current-window">
            {formatClock(current.start)} – {formatClock(current.end)}
          </span>
        </div>
      ) : (
        <div className="current-card idle">
          <h2 className="current-name">
            {beforeStart ? 'Not started yet' : finished ? 'Schedule finished' : 'No active class'}
          </h2>
          {beforeStart && slots.length > 0 && (
            <div className="current-countdown">starts {formatClock(slots[0].start)}</div>
          )}
        </div>
      )}

      <div className="upcoming">
        <h3 className="upcoming-title">Up next</h3>
        {upcoming.length === 0 ? (
          <p className="empty">Nothing scheduled after this.</p>
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
                <span className="upcoming-dur">{slot.entry.durationMin} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
