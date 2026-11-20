<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ONGLETS } from '../router'
import { usePrototype } from '../composables/usePrototype'
import DossierEntete from '../components/DossierEntete.vue'

const route = useRoute()
const router = useRouter()
const { dossier, lien } = usePrototype()

const titresOnglets = ONGLETS.map((o) => ({ title: o.titre, tabId: `tab-${o.name}`, panelId: `panel-${o.name}` }))

/*
 * Onglets DSFR synchronisés avec le routeur :
 * - l'onglet sélectionné se déduit de la route (ouvrir une URL ouvre le bon onglet, retour arrière compris) ;
 * - changer d'onglet (clic ou flèches du clavier) pousse la route correspondante.
 */
const indexOnglet = computed({
  get: () => Math.max(0, ONGLETS.findIndex((o) => o.name === route.name)),
  set(i: number) {
    const cible = ONGLETS[i]
    if (cible && cible.name !== route.name) router.push(lien(cible.name))
  },
})

const fil = computed(() => [
  { text: 'Accueil', to: '/' },
  { text: 'Dossiers et procédures', to: '/' },
  { text: `Dossier ${dossier.value.ref}` },
])

// Titre de page unique par onglet (RGAA 8.6)
watchEffect(() => {
  const onglet = ONGLETS[indexOnglet.value]
  document.title = `${onglet.titre} · Dossier ${dossier.value.ref} – Alexi`
})
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
    <DsfrBreadcrumb :links="fil" class="fr-mt-0 fr-mb-2w" />

    <DossierEntete />

    <DsfrTabs v-model="indexOnglet" class="alexi-onglets" tab-list-name="Sections du dossier" :tab-titles="titresOnglets">
      <DsfrTabContent
        v-for="(onglet, i) in ONGLETS"
        :key="onglet.name"
        :panel-id="`panel-${onglet.name}`"
        :tab-id="`tab-${onglet.name}`"
      >
        <RouterView v-if="i === indexOnglet" />
      </DsfrTabContent>
    </DsfrTabs>
  </div>
</template>
