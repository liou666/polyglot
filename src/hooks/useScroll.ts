export function useScroll<T extends HTMLElement=HTMLElement>() {
  const el = ref<T | null>(null)
  const scrollToBottom = () => {
    el.value?.scrollTo({
      top: el.value.scrollHeight,
      behavior: 'smooth',
    })
  }
  const scrollToTop = () => {
    el.value?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  const scrollTo = (y: number) => {
    el.value?.scrollTo({
      top: y,
      behavior: 'smooth',
    })
  }
  return {
    el,
    scrollToBottom,
    scrollToTop,
    scrollTo,
  }
}

