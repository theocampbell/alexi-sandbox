<script setup lang="ts">
import { computed } from 'vue'
import type { Commission } from '../data'
import { usePrototype } from '../composables/usePrototype'
import TableauDsfr from '../components/TableauDsfr.vue'

type TypeBadge = 'success' | 'error' | 'new' | 'info' | 'warning' | undefined

const { dossier, peutModifier } = usePrototype()

const org = computed(() => dossier.value.organismeAccompagnement)
const prochaine = computed(() => dossier.value.commissions.find((c) => c.statut === 'Inscrit') ?? null)

// Le libellé du badge porte l'information : la couleur n'est qu'un renfort
const badgeCommission: Record<Commission['statut'], TypeBadge> = { Inscrit: 'info', Examiné: 'success', Ajourné: 'warning' }
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
      <p v-if="prochaine">
        Prochain passage : <strong>{{ prochaine.instance }} · {{ prochaine.date }}</strong>
      </p>
      <TableauDsfr
        v-if="dossier.commissions.length"
        titre="Passages en commission"
        multiligne
        :entetes="['Date', 'Instance', 'Statut']"
      >
        <tr v-for="c in dossier.commissions" :key="c.date">
          <th scope="row">{{ c.date }}</th>
          <td>{{ c.instance }}</td>
          <td><DsfrBadge small no-icon :label="c.statut" :type="badgeCommission[c.statut]" /></td>
        </tr>
      </TableauDsfr>
      <p v-else>Ce dossier n’a été inscrit à aucune réunion.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-calendar-line" label="Inscrire en commission" />
    </section>


  </div>
</template>
