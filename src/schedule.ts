import type { Schedule, ScheduleEntry } from './types'

export interface TimelineSlot {
  entry: ScheduleEntry
  /** Index of the entry within the schedule's entry list. */
  index: number
  /** Repetition round (0-based) this slot belongs to. */
  round: number
  /** Absolute start time (ms epoch) for "today" using the schedule start time. */
  start: number
  /** Absolute end time (ms epoch). */
  end: number
}

function timeToEpoch(now: number, time: string): number {
  const [hh, mm] = time.split(':').map((n) => parseInt(n, 10))
  const d = new Date(now)
  d.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0)
  return d.getTime()
}

/**
 * Build absolute start/end timestamps for the class list, repeating it from
 * the schedule start time until the configured end time is reached. Both
 * times are anchored to the same calendar day as `now`.
 */
export function buildTimeline(schedule: Schedule, now: number): TimelineSlot[] {
  const startEpoch = timeToEpoch(now, schedule.startTime)
  let endEpoch = timeToEpoch(now, schedule.endTime)
  // Support sessions that run past midnight (e.g. 20:00 -> 01:00).
  if (endEpoch <= startEpoch) endEpoch += 24 * 60 * 60_000

  const totalDuration = schedule.entries.reduce(
    (sum, e) => sum + Math.max(0, e.durationMin) * 60_000,
    0,
  )
  if (totalDuration <= 0) return []

  const slots: TimelineSlot[] = []
  let cursor = startEpoch
  let round = 0
  // Cap the number of generated slots as a safety guard.
  const MAX_SLOTS = 10_000
  while (cursor < endEpoch && slots.length < MAX_SLOTS) {
    for (let index = 0; index < schedule.entries.length; index++) {
      if (cursor >= endEpoch) break
      const entry = schedule.entries[index]
      const start = cursor
      const end = start + Math.max(0, entry.durationMin) * 60_000
      cursor = end
      slots.push({ entry, index, round, start, end })
    }
    round++
  }
  return slots
}

export interface ActiveState {
  current: TimelineSlot | null
  upcoming: TimelineSlot[]
  /** Remaining milliseconds in the current class (0 if none active). */
  remainingMs: number
  /** True before the schedule has started. */
  beforeStart: boolean
  /** True after the last class has ended. */
  finished: boolean
}

export function getActiveState(slots: TimelineSlot[], now: number): ActiveState {
  if (slots.length === 0) {
    return { current: null, upcoming: [], remainingMs: 0, beforeStart: false, finished: false }
  }

  const first = slots[0]
  const last = slots[slots.length - 1]

  if (now < first.start) {
    return {
      current: null,
      upcoming: slots.slice(0, 4),
      remainingMs: 0,
      beforeStart: true,
      finished: false,
    }
  }

  if (now >= last.end) {
    return { current: null, upcoming: [], remainingMs: 0, beforeStart: false, finished: true }
  }

  const currentIndex = slots.findIndex((s) => now >= s.start && now < s.end)
  const current = currentIndex >= 0 ? slots[currentIndex] : null
  const upcoming = currentIndex >= 0 ? slots.slice(currentIndex + 1, currentIndex + 5) : []

  return {
    current,
    upcoming,
    remainingMs: current ? Math.max(0, current.end - now) : 0,
    beforeStart: false,
    finished: false,
  }
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatClock(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
