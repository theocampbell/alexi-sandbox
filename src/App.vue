<script setup lang="ts">
import PrototypeBar from './components/PrototypeBar.vue'

const quickLinks = [{ label: 'Prénom NOM', icon: 'fr-icon-account-circle-line', to: '/' }]
const navItems = [
  { text: 'Accueil', to: '/' },
  { text: 'Dossiers et procédures', to: '/' },
  { text: 'Commissions', to: '/' },
  { text: 'Administration', to: '/' },
]
</script>

<template>
  <DsfrSkipLinks :links="[{ id: 'contenu', text: 'Contenu' }]" />

  <PrototypeBar />

  <DsfrHeader
    service-title="Alexi"
    service-description="Sécuriser bailleurs et locataires contre les risques liés aux expulsions et aux impayés locatifs"
    home-to="/"
    :logo-text="['République', 'Française']"
    :quick-links="quickLinks"
  >
    <template #mainnav>
      <DsfrNavigation :nav-items="navItems" />
    </template>
  </DsfrHeader>

  <main id="contenu" tabindex="-1">
    <RouterView />
  </main>

  <DsfrFooter
    :logo-text="['République', 'Française']"
    desc-text="Alexi est une solution proposée par la DIHAL."
    :mandatory-links="[]"
    :ecosystem-links="[]"
  />
</template>
