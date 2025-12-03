export const useCountTo = (count: number, cb: (num: number) => void, duration: number) => {
  let start = 0
  let raf: ReturnType<typeof requestAnimationFrame> | null = null
  const interval = duration / count

  let last = -1

  const tick = (n: number) => {
    if (!start) start = n
    const elapsed = n - start

    const _new = Math.floor(elapsed / interval)

    if (_new !== last && _new <= count) {
      cb(_new)
      last = _new
    }
    if (_new <= count) {
      raf = requestAnimationFrame(tick)
    }
  }

  raf = requestAnimationFrame(tick)

  return () => raf && cancelAnimationFrame(raf)
}
