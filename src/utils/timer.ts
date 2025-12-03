export interface TimerInterval {
  pause: () => void
  abort: () => void
  resume: () => void
}

export const interval = (
  callback: (now: number, controller: AbortController) => void,
  duration: number,
): TimerInterval => {
  if (typeof callback !== 'function') throw new Error('callback must be a function!')
  if (!duration || duration < 0) throw new Error('duration must be >0!')

  const controller = new AbortController()
  const { signal } = controller

  let last = performance.now()
  let raf: number | null = null
  let lator = 0
  let count = 0
  let paused = false

  const run = (t: number) => {
    if (signal.aborted || paused) return

    const delta = t - last
    last = t

    lator += delta

    while (lator >= duration) {
      lator -= duration
      callback(++count, controller)
      if (signal.aborted) return
    }
    raf = requestAnimationFrame(run)
  }
  raf = requestAnimationFrame(run)

  return {
    pause: () => {
      paused = true
      if (raf) cancelAnimationFrame(raf)
    },
    abort: () => {
      controller.abort()
      if (raf) cancelAnimationFrame(raf)
    },
    resume: () => {
      if (!paused) return
      paused = false
      last = performance.now()
      raf = requestAnimationFrame(run)
    },
  }
}

export const timeout = (callback: () => void, delay: number): TimerInterval => {
  const inter = interval(() => {
    callback()
    inter.abort()
  }, delay)
  return inter
}
