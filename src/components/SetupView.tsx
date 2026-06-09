import { DEFAULT_COLORS, MAX_ENTRIES, type Schedule, type ScheduleEntry } from '../types'
import { beep } from '../sound'

interface Props {
  schedule: Schedule
  update: (updater: (prev: Schedule) => Schedule) => void
}

function createId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export default function SetupView({ schedule, update }: Props) {
  const atMax = schedule.entries.length >= MAX_ENTRIES

  function setStartTime(startTime: string) {
    update((prev) => ({ ...prev, startTime }))
  }

  function setEndTime(endTime: string) {
    update((prev) => ({ ...prev, endTime }))
  }

  function setBeepEnabled(beepEnabled: boolean) {
    if (beepEnabled) {
      // Unlock and preview the beep from within the click gesture.
      beep(schedule.beepDurationSec * 1000)
    }
    update((prev) => ({ ...prev, beepEnabled }))
  }

  function setBeepDuration(value: number) {
    const beepDurationSec = Math.min(10, Math.max(1, Math.round(value)))
    update((prev) => ({ ...prev, beepDurationSec }))
  }

  function addEntry() {
    update((prev) => {
      if (prev.entries.length >= MAX_ENTRIES) return prev
      const color = DEFAULT_COLORS[prev.entries.length % DEFAULT_COLORS.length]
      const entry: ScheduleEntry = {
        id: createId(),
        className: `Class ${prev.entries.length + 1}`,
        durationMin: 10,
        color,
      }
      return { ...prev, entries: [...prev.entries, entry] }
    })
  }

  function updateEntry(id: string, patch: Partial<ScheduleEntry>) {
    update((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }

  function removeEntry(id: string) {
    update((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }))
  }

  function move(id: string, direction: -1 | 1) {
    update((prev) => {
      const index = prev.entries.findIndex((e) => e.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= prev.entries.length) return prev
      const entries = [...prev.entries]
      ;[entries[index], entries[target]] = [entries[target], entries[index]]
      return { ...prev, entries }
    })
  }

  return (
    <section className="setup">
      <div className="setup-toolbar">
        <label className="field">
          <span className="field-label">Start time</span>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">End time</span>
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button className="btn primary" onClick={addEntry} disabled={atMax}>
          + Add class
        </button>
        <span className="entry-count">
          {schedule.entries.length} / {MAX_ENTRIES}
        </span>
      </div>

      <div className="beep-settings">
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={schedule.beepEnabled}
            onChange={(e) => setBeepEnabled(e.target.checked)}
          />
          <span>Beep on class change</span>
        </label>

        {schedule.beepEnabled && (
          <div className="beep-length">
            <span className="beep-length-label">Length</span>
            <input
              type="number"
              min={1}
              max={10}
              value={schedule.beepDurationSec}
              onChange={(e) => setBeepDuration(Number(e.target.value))}
            />
            <span className="beep-length-unit">sec</span>
          </div>
        )}
      </div>

      {schedule.entries.length === 0 ? (
        <p className="empty">No classes yet. Add your first class to build the schedule.</p>
      ) : (
        <ul className="entry-list">
          {schedule.entries.map((entry, i) => (
            <li key={entry.id} className="entry-row" style={{ borderLeftColor: entry.color }}>
              <input
                type="color"
                className="entry-color"
                value={entry.color}
                onChange={(e) => updateEntry(entry.id, { color: e.target.value })}
                aria-label="Class color"
              />
              <div className="entry-fields">
                <label className="entry-field">
                  <span className="entry-field-label">Class</span>
                  <input
                    type="text"
                    className="entry-name"
                    value={entry.className}
                    placeholder="Class name"
                    onChange={(e) => updateEntry(entry.id, { className: e.target.value })}
                  />
                </label>
                <label className="entry-field">
                  <span className="entry-field-label">Time</span>
                  <span className="entry-duration">
                    <input
                      type="number"
                      min={1}
                      value={entry.durationMin}
                      onChange={(e) =>
                        updateEntry(entry.id, { durationMin: Math.max(0, Number(e.target.value)) })
                      }
                    />
                    <span>min</span>
                  </span>
                </label>
              </div>
              <div className="entry-actions">
                <button className="btn icon" onClick={() => move(entry.id, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button
                  className="btn icon"
                  onClick={() => move(entry.id, 1)}
                  disabled={i === schedule.entries.length - 1}
                >
                  ↓
                </button>
                <button className="btn icon danger" onClick={() => removeEntry(entry.id)}>
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
