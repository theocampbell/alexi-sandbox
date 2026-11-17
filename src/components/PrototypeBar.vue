<script setup lang="ts">
import { OPTIONS_ETAT, OPTIONS_PROFIL, type EtatId, type ProfilId } from '../data'
import { useRoute } from 'vue-router'
import { usePrototype } from '../composables/usePrototype'

const { etat, profil } = usePrototype()
const route = useRoute()

const changerEtat = (v: unknown) => (etat.value = v as EtatId)
const changerProfil = (v: unknown) => (profil.value = v as ProfilId)
</script>

<template>
  <!-- Barre du prototype : hors maquette -->
  <div class="alexi-proto-bar" role="region" aria-label="Réglages du prototype">
    <div class="fr-container fr-py-2w">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
        <!-- Pas de dossier sur la page de comparaison des graphiques -->
        <template v-if="route.params.num">
        <div class="fr-col-12 fr-col-md-5">
          <DsfrSelect
            select-id="proto-etat"
            label="Prototype · état du dossier"
            :model-value="etat"
            :options="OPTIONS_ETAT"
            @update:model-value="changerEtat"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrSelect
            select-id="proto-profil"
            label="Prototype · profil"
            :model-value="profil"
            :options="OPTIONS_PROFIL"
            @update:model-value="changerProfil"
          />
        </div>
        </template>
        <div class="fr-col-12 fr-col-md-3">
          <p class="fr-text--xs fr-mb-1w">Données fictives. Les modales d'édition existantes ne sont pas reproduites.</p>
          <p class="fr-text--xs fr-mb-0">
            <RouterLink to="/graphiques">Comparer les graphiques de la dette</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
