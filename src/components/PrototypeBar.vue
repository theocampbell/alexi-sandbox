<script setup lang="ts">
import { OPTIONS_ETAT, OPTIONS_PROFIL, type EtatId, type ProfilId } from '../data'
import { usePrototype } from '../composables/usePrototype'

const { etat, profil } = usePrototype()

const changerEtat = (v: unknown) => (etat.value = v as EtatId)
const changerProfil = (v: unknown) => (profil.value = v as ProfilId)
</script>

<template>
  <!-- Barre du prototype : hors maquette -->
  <div class="alexi-proto-bar" role="region" aria-label="Réglages du prototype">
    <div class="fr-container alexi-container fr-py-2w">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
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
        <div class="fr-col-12 fr-col-md-3">
          <p class="fr-text--xs fr-mb-0">Données fictives. Les modales d'édition existantes ne sont pas reproduites.</p>
        </div>
      </div>
    </div>
  </div>
</template>
