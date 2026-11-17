<script setup lang="ts">
import { computed } from 'vue'
import { usePrototype } from '../composables/usePrototype'
import ReunionCommission from '../components/ReunionCommission.vue'

const { dossier, peutModifier } = usePrototype()

const org = computed(() => dossier.value.organismeAccompagnement)

</script>

<template>
  <div>
    <!-- Organisme d'accompagnement sociojuridique : la structure, pas une personne -->
    <section id="organisme" class="fr-mb-8w" aria-labelledby="titre-organisme">
      <h2 id="titre-organisme" class="fr-h4">Organisme d’accompagnement sociojuridique</h2>
      <template v-if="org">
        <div class="alexi-ligne-titre">
          <div class="alexi-coupe">
            <p class="fr-text--lg fr-mb-1v"><strong>{{ org.nom }}</strong></p>
            <p class="fr-text--sm fr-mb-0">{{ org.type }} · désigné le {{ org.depuis }}<br />{{ org.contact }}</p>
          </div>
          <DsfrButton v-if="peutModifier" tertiary size="sm" icon="fr-icon-refresh-line" label="Changer d’organisme" />
        </div>
      </template>
      <template v-else>
        <p>Aucun organisme d’accompagnement sociojuridique n’est désigné.</p>
        <DsfrButton v-if="peutModifier" secondary icon="fr-icon-add-line" label="Désigner un organisme" />
      </template>
    </section>

    <!-- Commissions -->
    <section id="commissions" class="fr-mb-8w" aria-labelledby="titre-commissions">
      <h2 id="titre-commissions" class="fr-h4">Commissions</h2>
      <ul v-if="dossier.commissions.length" class="alexi-reunions">
        <li v-for="c in dossier.commissions" :key="c.date">
          <ReunionCommission :reunion="c" :peut-modifier="peutModifier" />
        </li>
      </ul>
      <p v-else>Ce dossier n’a été inscrit à aucune réunion.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-calendar-line" label="Inscrire en commission" />
    </section>


  </div>
</template>
