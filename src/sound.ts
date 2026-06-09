let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

/**
 * Play a short beep using the Web Audio API.
 * @param durationMs length of the beep in milliseconds (default 1000).
 */
export function beep(durationMs = 1000): void {
  const ctx = getContext()
  if (!ctx) return
  // Browsers may suspend the context until a user gesture has occurred.
  if (ctx.state === 'suspended') void ctx.resume()

  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880

  const seconds = durationMs / 1000
  // Short fade in/out to avoid clicks.
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.3, now + 0.02)
  gain.gain.setValueAtTime(0.3, now + Math.max(0.02, seconds - 0.05))
  gain.gain.linearRampToValueAtTime(0, now + seconds)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + seconds)
}

/** Resume the audio context from within a user gesture (e.g. a click). */
export function unlockAudio(): void {
  const ctx = getContext()
  if (ctx && ctx.state === 'suspended') void ctx.resume()
}
