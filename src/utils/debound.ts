export const useDebound = <T extends (...args: unknown[]) => unknown>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>[]) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn(...(args as unknown as Parameters<T>))
    }, delay)
  }
}
