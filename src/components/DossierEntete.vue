<script setup lang="ts">
import { computed } from 'vue'
import { usePrototype } from '../composables/usePrototype'

const { dossier, procedureEnCours, etapeEnCours, peutModifier } = usePrototype()

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
      <!-- Actions du dossier, sur tous les onglets. Le téléchargement n'est pas une édition : visible pour tous les profils. -->
      <div class="alexi-entete-actions">
        <DsfrButton v-if="peutModifier" secondary icon="fr-icon-calendar-line" label="Inscrire en commission" />
        <!-- Simple lien de téléchargement (sans format ni poids, à la demande) -->
        <a
          class="fr-link fr-icon-download-line fr-link--icon-right"
          href="#"
          :download="`fiche-synthese-${dossier.ref}.docx`"
          @click.prevent
        >Télécharger la fiche de synthèse</a>
      </div>
    </div>

    <!-- Une seule petite ligne : référents · dates -->
    <p class="alexi-meta fr-text--sm fr-mt-2w fr-mb-0 alexi-coupe">
      <template v-if="dossier.referents.length">
        {{ dossier.referents.length > 1 ? 'Référents' : 'Référent' }} :
        <template v-for="(r, i) in dossier.referents" :key="r.email">
          <template v-if="i > 0">, </template>
          <a :href="`mailto:${r.email}`" :title="`Écrire à ${r.nom} (${r.email})`">{{ r.nom }}</a>
        </template>
      </template>
      <template v-else>Pas de référent</template>
      <!-- Gestionnaire et administrateur peuvent modifier les référents -->
      <DsfrButton
        v-if="peutModifier"
        class="fr-ml-1w"
        tertiary
        no-outline
        size="sm"
        :label="dossier.referents.length ? 'Modifier' : 'Désigner'"
        :aria-label="dossier.referents.length ? 'Modifier les référents' : 'Désigner un référent'"
      />
      · Créé le {{ dossier.cree }} · Modifié le {{ dossier.modifie }}
    </p>
  </div>
</template>
