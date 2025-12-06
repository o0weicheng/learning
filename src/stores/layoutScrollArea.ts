import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutScrollStore = defineStore('layoutScroll', () => {
  const scrollEl = ref<HTMLElement | null>(null)

  const setScrollEl = (el: HTMLElement) => (scrollEl.value = el)

  const scrollTo = (top: number) =>
    scrollEl.value?.scrollTo({
      top,
    })

  return {
    scrollEl,
    setScrollEl,
    scrollTo,
  }
})
