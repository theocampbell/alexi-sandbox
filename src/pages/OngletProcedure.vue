<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePrototype } from '../composables/usePrototype'

const { dossier } = usePrototype()

const options = computed(() =>
  dossier.value.procedures.map((p, i) => ({
    value: String(i),
    text: `${p.motif} · ${p.close ? `close le ${p.fin}` : `en cours depuis le ${p.depuis}`}`,
  })),
)
const choix = ref('0')
watch(dossier, () => (choix.value = '0'))
</script>

<template>
  <div>
    <div v-if="dossier.procedures.length > 1" class="fr-mb-4w" style="max-width: 30rem">
      <DsfrSelect
        select-id="sel-proc"
        label="Procédure affichée"
        :model-value="choix"
        :options="options"
        @update:model-value="(v: unknown) => (choix = String(v))"
      />
    </div>
    <DsfrCallout
      title="Contenu inchangé"
      title-tag="h2"
      icon="fr-icon-information-line"
      content="Ici s’affiche l’onglet Procédure actuel tel quel : étapes, documents et commentaires. Seule la liste « Procédure affichée » est ajoutée quand le dossier compte plusieurs procédures."
    />
  </div>
</template>
