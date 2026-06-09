export interface ScheduleEntry {
  id: string
  className: string
  durationMin: number
  color: string
}

export interface Schedule {
  /** Start time of the first class as "HH:MM" (24h, local time). */
  startTime: string
  /** End time of the session as "HH:MM" (24h, local time). The class list
   *  repeats from the start time until this time is reached. */
  endTime: string
  /** Ordered list of classes, max 10 entries. */
  entries: ScheduleEntry[]
}

export const MAX_ENTRIES = 10

/** Distinct default colors used when adding new entries. */
export const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#a3a3a3', // gray
]

export function createEmptySchedule(): Schedule {
  return {
    startTime: '10:00',
    endTime: '17:00',
    entries: [],
  }
}
