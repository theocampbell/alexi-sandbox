<script setup lang="ts">
/** Valeur CAF : « Non renseigné » en gris pour ne pas se lire comme une réponse ; « Non » reste en texte normal. */
defineProps<{ valeur: string | null }>()
</script>

<template>
  <span v-if="valeur === null" class="fr-text-mention--grey">Non renseigné</span>
  <template v-else>{{ valeur }}</template>
</template>
