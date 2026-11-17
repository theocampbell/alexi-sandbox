<script setup lang="ts">
/**
 * Une réunion de commission dans laquelle le dossier est inscrit,
 * sur le modèle de l'application actuelle : titre, statut, heure, commission, actions.
 */
import { ref } from 'vue'
import type { Commission } from '../data'

const props = defineProps<{ reunion: Commission; peutModifier: boolean }>()

const ouvert = ref(false)
const idDetail = `reunion-${props.reunion.date.replace(/\s/g, '-')}`
const titre = `Réunion du ${props.reunion.date}`
</script>

<template>
  <div class="alexi-reunion">
    <div class="alexi-reunion__ligne">
      <h3 class="fr-text--md fr-text--bold fr-mb-0">{{ titre }}</h3>
      <DsfrBadge small no-icon :label="reunion.statut" :type="reunion.statut === 'À venir' ? 'info' : 'standard'" />
      <p class="fr-mb-0 alexi-reunion__info">
        <span class="fr-icon-time-line fr-icon--sm" aria-hidden="true"></span>
        <span class="fr-sr-only">Heure : </span>{{ reunion.heure }}
      </p>
      <p class="fr-mb-0 alexi-reunion__info">
        <span class="fr-icon-bank-line fr-icon--sm" aria-hidden="true"></span>
        <span class="fr-sr-only">Commission : </span>{{ reunion.instance }}
      </p>
      <div class="alexi-actions alexi-reunion__actions">
        <template v-if="peutModifier">
          <DsfrButton tertiary size="sm" icon="fr-icon-calendar-line" icon-only :label="`Changer de réunion (${titre})`" />
          <DsfrButton tertiary size="sm" icon="fr-icon-close-line" icon-only :label="`Retirer le dossier de la ${titre.toLowerCase()}`" />
        </template>
        <DsfrButton
          tertiary
          size="sm"
          :icon="ouvert ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
          icon-only
          :label="`${ouvert ? 'Masquer' : 'Afficher'} le détail de la ${titre.toLowerCase()}`"
          :aria-expanded="ouvert"
          :aria-controls="idDetail"
          @click="ouvert = !ouvert"
        />
      </div>
    </div>
    <div v-show="ouvert" :id="idDetail" class="fr-mt-2w">
      <p class="fr-text--sm fr-mb-0">Contenu inchangé : détail actuel de la réunion dans l’application.</p>
    </div>
  </div>
</template>
