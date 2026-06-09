let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

/**
 * Play a horn-style tone using the Web Audio API.
 *
 * The horn timbre comes from stacking several slightly detuned sawtooth
 * oscillators (fundamental + harmonics) shaped by a low-pass filter, giving a
 * fuller, brassier sound than a pure sine beep.
 * @param durationMs length of the tone in milliseconds (default 1000).
 */
export function beep(durationMs = 1000): void {
  const ctx = getContext()
  if (!ctx) return
  // Browsers may suspend the context until a user gesture has occurred.
  if (ctx.state === 'suspended') void ctx.resume()

  const now = ctx.currentTime
  const seconds = durationMs / 1000

  // Master gain with a horn-like envelope: quick-ish attack, sustained body,
  // gentle release to avoid clicks.
  const master = ctx.createGain()
  const attack = 0.05
  const release = 0.12
  const peak = 0.35
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(peak, now + Math.min(attack, seconds / 2))
  master.gain.setValueAtTime(peak, now + Math.max(attack, seconds - release))
  master.gain.linearRampToValueAtTime(0, now + seconds)

  // Low-pass filter tames the harsh top end of the sawtooths for a warm horn.
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2200
  filter.Q.value = 0.7

  filter.connect(master)
  master.connect(ctx.destination)

  // Fundamental plus harmonics, with slight detune for a thick horn chorus.
  const fundamental = 330 // ~E4, typical horn-ish pitch
  const partials = [
    { ratio: 1, gain: 1.0, detune: -4 },
    { ratio: 1, gain: 0.6, detune: 5 },
    { ratio: 2, gain: 0.4, detune: 0 },
    { ratio: 3, gain: 0.18, detune: 0 },
  ]

  const oscillators: OscillatorNode[] = []
  for (const p of partials) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = fundamental * p.ratio
    osc.detune.value = p.detune

    const oscGain = ctx.createGain()
    oscGain.gain.value = p.gain

    osc.connect(oscGain)
    oscGain.connect(filter)
    osc.start(now)
    osc.stop(now + seconds)
    oscillators.push(osc)
  }
}

/** Resume the audio context from within a user gesture (e.g. a click). */
export function unlockAudio(): void {
  const ctx = getContext()
  if (ctx && ctx.state === 'suspended') void ctx.resume()
}
