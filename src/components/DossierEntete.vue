<script setup lang="ts">
import { computed } from 'vue'
import { usePrototype } from '../composables/usePrototype'

const { dossier, procedureEnCours, etapeEnCours, peutModifier, estAdmin } = usePrototype()

const principal = computed(() => dossier.value.locaux.find((l) => l.principal) ?? dossier.value.locaux[0])

const ligne = computed(() => {
  const occ = dossier.value.occupants
  const autres = occ.length - 1
  const qui = occ[0].nom + (autres > 0 ? ` et ${autres} ${autres > 1 ? 'autres occupants' : 'autre occupant'}` : '')
  return `${qui} · ${principal.value.titre} ${principal.value.ligne2}`
})

const nbAutresLocaux = computed(() => dossier.value.locaux.length - 1)
</script>

<template>
  <div class="fr-mb-4w">
    <div class="alexi-ligne-titre">
      <div>
        <h1 class="fr-h2 fr-mb-2w">Dossier {{ dossier.ref }}</h1>
        <ul class="fr-badges-group fr-mb-1w">
          <template v-if="procedureEnCours">
            <li><DsfrBadge :label="procedureEnCours.motif" type="warning" no-icon /></li>
            <li v-if="etapeEnCours"><DsfrBadge :label="`Étape : ${etapeEnCours}`" type="info" no-icon /></li>
          </template>
          <li v-else><DsfrBadge label="Aucune procédure en cours" /></li>
          <li v-if="dossier.vulnerable"><DsfrBadge label="Vulnérabilité" type="new" no-icon /></li>
        </ul>
        <p class="fr-text--lg fr-mb-0 alexi-coupe">
          {{ ligne }}
          <template v-if="nbAutresLocaux > 0">
            · + {{ nbAutresLocaux }} {{ nbAutresLocaux > 1 ? 'locaux' : 'local' }}
          </template>
        </p>
      </div>
      <div v-if="peutModifier">
        <DsfrButton secondary icon="fr-icon-calendar-line" label="Inscrire en commission" />
      </div>
    </div>

    <!-- Une seule petite ligne : organisation · agent · dates -->
    <p class="alexi-meta fr-text--sm fr-mt-2w fr-mb-0 alexi-coupe">
      Organisation référente :
      <strong v-if="dossier.orgRef">{{ dossier.orgRef }}</strong>
      <template v-else>aucune</template>
      <DsfrButton
        v-if="estAdmin"
        class="fr-ml-1w"
        tertiary
        no-outline
        size="sm"
        :label="dossier.orgRef ? 'Modifier' : 'Désigner'"
        :aria-label="dossier.orgRef ? 'Modifier l’organisation référente' : 'Désigner l’organisation référente'"
      />
      ·
      Agent référent :
      <template v-if="dossier.agent">
        {{ dossier.agent.nom }} (<a :href="`mailto:${dossier.agent.email}`">{{ dossier.agent.email }}</a>)
      </template>
      <template v-else>non renseigné</template>
      · Créé le {{ dossier.cree }} · Modifié le {{ dossier.modifie }}
    </p>
  </div>
</template>
