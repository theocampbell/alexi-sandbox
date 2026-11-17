<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatEuros, type PointDette } from '../data'
import DetteTableau from './DetteTableau.vue'

const props = defineProps<{ points: PointDette[] }>()

const donneesVisibles = ref(false)

// DSFR Chart attend des listes de listes sérialisées en JSON
const x = computed(() => JSON.stringify([props.points.map((p) => p.date)]))
const y = computed(() => JSON.stringify([props.points.map((p) => p.montant)]))

// Alternative courte au graphique (le canvas n'est pas lisible par les technologies d'assistance)
const resume = computed(
  () =>
    'Graphique en barres du montant de la dette à chaque mise à jour : ' +
    props.points.map((p) => `${p.date} (${p.origine}), ${formatEuros(p.montant)}`).join(' ; '),
)
</script>

<template>
  <div>
    <h3 class="fr-h6 fr-mb-2w">Évolution de la dette</h3>
    <div class="alexi-graphique" role="img" :aria-label="resume">
      <bar-chart :x="x" :y="y" name='["Dette locative"]' unit-tooltip="€" selected-palette="default" />
    </div>
    <DsfrButton
      class="fr-mt-2w"
      tertiary
      size="sm"
      :icon="donneesVisibles ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
      :label="donneesVisibles ? 'Masquer les données' : 'Voir les données'"
      :aria-expanded="donneesVisibles"
      aria-controls="dette-donnees"
      @click="donneesVisibles = !donneesVisibles"
    />
    <div v-show="donneesVisibles" id="dette-donnees" class="fr-mt-2w">
      <DetteTableau :points="points" />
    </div>
  </div>
</template>
