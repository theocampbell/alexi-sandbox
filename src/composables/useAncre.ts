import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Ancre de section (#occupants, #commissions…) : on fait défiler jusqu'à la section
 * et on y place le focus, après que l'onglet a pris le focus lors de son activation.
 * Les sections ciblées portent tabindex="-1".
 */
export function useAncre() {
  const route = useRoute()
  function allerASection() {
    const id = route.hash.replace('#', '')
    if (!id) return
    nextTick(() =>
      setTimeout(() => {
        const el = document.getElementById(id)
        if (!el) return
        el.focus({ preventScroll: true })
        el.scrollIntoView({ block: 'start' })
      }, 50),
    )
  }
  onMounted(allerASection)
  watch(() => route.hash, allerASection)
}
