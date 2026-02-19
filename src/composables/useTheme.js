import { ref } from 'vue'

const isLight = ref(document.documentElement.classList.contains('light'))

export function useTheme() {
  function toggle() {
    isLight.value = !isLight.value
    document.documentElement.classList.toggle('light', isLight.value) // ?
    localStorage.setItem('theme', isLight.value ? 'light' : 'dark')
  }

  return { isLight, toggle }
}
