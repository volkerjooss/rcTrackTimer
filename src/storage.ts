import { useCallback, useEffect, useState } from 'react'
import { createEmptySchedule, type Schedule } from './types'

const STORAGE_KEY = 'rcTrackTimer.schedule.v1'

function loadSchedule(): Schedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptySchedule()
    const parsed = JSON.parse(raw) as Schedule
    if (!parsed || !Array.isArray(parsed.entries) || typeof parsed.startTime !== 'string') {
      return createEmptySchedule()
    }
    // Backfill fields added after the initial version.
    if (typeof parsed.endTime !== 'string') {
      parsed.endTime = createEmptySchedule().endTime
    }
    return parsed
  } catch {
    return createEmptySchedule()
  }
}

/**
 * Schedule state persisted to localStorage, so it is scoped to the
 * individual browser/session as described in the project requirements.
 */
export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>(loadSchedule)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
    } catch {
      // Ignore storage write errors (e.g. private mode quota).
    }
  }, [schedule])

  const update = useCallback((updater: (prev: Schedule) => Schedule) => {
    setSchedule((prev) => updater(prev))
  }, [])

  return { schedule, setSchedule, update }
}
