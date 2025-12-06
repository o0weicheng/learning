export type OnionTask = (next: OnionTaskNext) => Promise<void> | void
export type OnionTaskNext = () => Promise<void>

export const onion_model = () => {
  const _TASK: OnionTask[] = []

  const run = async () => {
    const dispatch = async (i: number): Promise<void> => {
      const task = _TASK[i]
      if (!task) return

      const next: OnionTaskNext = async () => await dispatch(i + 1)

      try {
        await task(next)
      } catch (error) {
        throw new Error(error as string)
      }
    }
    await dispatch(0)
  }

  const add = (task: OnionTask) => _TASK.push(task)

  return {
    add,
    run,
  }
}
