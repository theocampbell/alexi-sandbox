<script setup lang="ts">
/**
 * Courbe de la dette en SVG simple :
 * - segments droits (pas de lissage qui inventerait des montants) ;
 * - points placés selon les vraies dates ;
 * - montants au format français ;
 * - couleurs DSFR (variables CSS), donc thème clair et sombre.
 */
import { computed } from 'vue'
import { formatEuros, type PointDette } from '../data'

const props = defineProps<{ points: PointDette[] }>()

const MOIS: Record<string, number> = {
  'janv.': 0, 'févr.': 1, mars: 2, 'avr.': 3, mai: 4, juin: 5,
  'juil.': 6, août: 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11,
}
/** « 3 déc. 2025 », « 1er sept. 2026 » → timestamp */
function lireDate(d: string) {
  const [j, m, a] = d.replace('1er', '1').split(' ')
  return new Date(Number(a), MOIS[m] ?? 0, Number(j)).getTime()
}

const L = 560
const H = 280
const M = { haut: 16, droite: 24, bas: 40, gauche: 72 }
const largeur = L - M.gauche - M.droite
const hauteur = H - M.haut - M.bas

const format0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
// L'espace fine insécable (U+202F) des milliers n'est pas rendue par la police : espace insécable classique
const euros0 = { format: (n: number) => format0.format(n).replace(/\u202f/g, '\u00a0') }

const geo = computed(() => {
  const t = props.points.map((p) => lireDate(p.date))
  const t0 = Math.min(...t)
  const t1 = Math.max(...t)
  // Graduation « ronde » de l'axe des montants, à partir de 0
  const max = Math.max(...props.points.map((p) => p.montant))
  const pas = [500, 1000, 2000, 2500, 5000, 10000].find((s) => max / s <= 5) ?? 10000
  const haut = Math.ceil(max / pas) * pas
  const graduations = Array.from({ length: haut / pas + 1 }, (_, i) => i * pas)
  const x = (ti: number) => M.gauche + (t1 === t0 ? largeur / 2 : ((ti - t0) / (t1 - t0)) * largeur)
  const y = (v: number) => M.haut + hauteur - (v / haut) * hauteur
  const pts = props.points.map((p, i) => ({ ...p, cx: x(t[i]), cy: y(p.montant) }))
  // Étiquettes de date : la première et la dernière toujours affichées,
  // celles du milieu seulement si elles ne chevauchent pas leurs voisines
  const n = pts.length
  const derniere = pts[n - 1].cx
  let precedente = -Infinity
  const etiquettes = pts.map((p, i) => {
    const ok = i === 0 || i === n - 1 || (p.cx - precedente >= 130 && derniere - p.cx >= 130)
    if (ok) precedente = p.cx
    return ok
  })
  // Première et dernière ancrées vers l'intérieur pour ne pas sortir du cadre
  const ancre = (i: number) => (n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle')
  return { pts, graduations, y, etiquettes, ancre }
})

const resume = computed(
  () =>
    'Courbe du montant de la dette à chaque mise à jour : ' +
    props.points.map((p) => `${p.date} (${p.origine}), ${formatEuros(p.montant)}`).join(' ; '),
)
</script>

<template>
  <svg class="alexi-courbe" :viewBox="`0 0 ${L} ${H}`" role="img" :aria-label="resume">
    <!-- Grille et axe des montants -->
    <g v-for="g in geo.graduations" :key="g">
      <line class="alexi-courbe__grille" :x1="M.gauche" :x2="L - M.droite" :y1="geo.y(g)" :y2="geo.y(g)" />
      <text class="alexi-courbe__texte" :x="M.gauche - 8" :y="geo.y(g)" text-anchor="end" dominant-baseline="middle">
        {{ euros0.format(g) }}
      </text>
    </g>
    <!-- Ligne : segments droits -->
    <polyline class="alexi-courbe__ligne" :points="geo.pts.map((p) => `${p.cx},${p.cy}`).join(' ')" />
    <!-- Points et dates -->
    <g v-for="(p, i) in geo.pts" :key="i">
      <circle class="alexi-courbe__point" :cx="p.cx" :cy="p.cy" r="5">
        <title>{{ p.date }} · {{ p.origine }} · {{ formatEuros(p.montant) }}</title>
      </circle>
      <text
        v-if="geo.etiquettes[i]"
        class="alexi-courbe__texte"
        :x="p.cx"
        :y="H - M.bas + 24"
        :text-anchor="geo.ancre(i)"
      >
        {{ p.date }}
      </text>
    </g>
  </svg>
</template>
