export const useThrotf = <T extends (args: unknown[]) => unknown>(fn: T, delay: number) => {
  let laster: ReturnType<typeof Date.now> = 0

  return (...args: Parameters<T>) => {
    const n = Date.now()

    if (n - laster >= delay) {
      fn(args)
      laster = n
    }
  }
}
