<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePrototype } from '../composables/usePrototype'
import DetteTableau from '../components/DetteTableau.vue'

const { dossier } = usePrototype()

const options = computed(() =>
  dossier.value.procedures.map((p, i) => ({
    value: String(i),
    text: `${p.motif} · ${p.close ? `close le ${p.fin}` : `en cours depuis le ${p.depuis}`}`,
  })),
)
const choix = ref('0')
watch(dossier, () => (choix.value = '0'))
const affichee = computed(() => dossier.value.procedures[Number(choix.value)])
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
      content="Ici s’affiche l’onglet Procédure actuel tel quel : étapes, documents et commentaires. Ajouts : la liste « Procédure affichée » quand le dossier compte plusieurs procédures et, pour une procédure close, son tableau de dette."
    />

    <!-- Procédure close : sa dette est affichée ici, en lecture seule (celle de la procédure en cours est dans Informations) -->
    <section v-if="affichee?.close && affichee.dette" class="fr-mt-6w" aria-labelledby="titre-dette-close">
      <h2 id="titre-dette-close" class="fr-h4 fr-mb-1w">Dette locative</h2>
      <p class="fr-text--sm">Procédure close : {{ affichee.motif }}, du {{ affichee.depuis }} au {{ affichee.fin }}</p>
      <DetteTableau
        :points="affichee.dette"
        :titre="`Informations sur la dette locative de la procédure close le ${affichee.fin}`"
      />
    </section>
  </div>
</template>
