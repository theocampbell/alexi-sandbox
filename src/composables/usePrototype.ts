import { computed } from 'vue'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { ETATS, ETAPES, type EtatId, type ProfilId } from '../data'

const ETAT_IDS = Object.keys(ETATS) as EtatId[]
const PROFIL_IDS: ProfilId[] = ['gestionnaire', 'admin', 'lecture']

/**
 * État du prototype : le dossier affiché et le profil viennent de l'URL
 * (?etat=…&profil=…) pour pouvoir partager un lien vers un cas précis.
 */
export function usePrototype() {
  const route = useRoute()
  const router = useRouter()

  const etat = computed<EtatId>({
    get() {
      const q = route.query.etat
      if (typeof q === 'string' && ETAT_IDS.includes(q as EtatId)) return q as EtatId
      // Sans ?etat, on retrouve l'état à partir du numéro de dossier de l'URL
      return ETAT_IDS.find((id) => ETATS[id].ref === route.params.num) ?? 'complet'
    },
    set(v) {
      router.replace({
        name: route.name ?? 'synthese',
        params: { num: ETATS[v].ref },
        query: { ...route.query, etat: v },
      })
    },
  })

  const profil = computed<ProfilId>({
    get() {
      const q = route.query.profil
      return typeof q === 'string' && PROFIL_IDS.includes(q as ProfilId) ? (q as ProfilId) : 'gestionnaire'
    },
    set(v) {
      router.replace({ query: { ...route.query, profil: v } })
    },
  })

  const dossier = computed(() => ETATS[etat.value])
  const procedureEnCours = computed(() => dossier.value.procedures.find((p) => !p.close) ?? null)
  const etapeEnCours = computed(() => {
    const e = procedureEnCours.value?.etape
    return e === null || e === undefined ? null : ETAPES[e]
  })

  /** Le profil lecture seule n'a aucune action : les boutons sont retirés, pas désactivés */
  const peutModifier = computed(() => profil.value !== 'lecture')
  const estAdmin = computed(() => profil.value === 'admin')

  /** Lien vers un onglet du dossier courant, en gardant ?etat et ?profil */
  const lien = (name: string): RouteLocationRaw => ({
    name,
    params: { num: dossier.value.ref },
    query: route.query,
  })

  return { etat, profil, dossier, procedureEnCours, etapeEnCours, peutModifier, estAdmin, lien }
}
