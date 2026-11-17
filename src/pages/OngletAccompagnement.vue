<script setup lang="ts">
import { computed } from 'vue'
import type { Commission, Dispositif } from '../data'
import { usePrototype } from '../composables/usePrototype'
import TableauDsfr from '../components/TableauDsfr.vue'

type TypeBadge = 'success' | 'error' | 'new' | 'info' | 'warning' | undefined

const { dossier, peutModifier } = usePrototype()

const acc = computed(() => dossier.value.accompagnement)
const prochaine = computed(() => dossier.value.commissions.find((c) => c.statut === 'Inscrit') ?? null)

// Le libellé du badge porte l'information : la couleur n'est qu'un renfort
const badgeCommission: Record<Commission['statut'], TypeBadge> = { Inscrit: 'info', Examiné: 'success', Ajourné: 'warning' }
const badgeDispositif: Record<Dispositif['statut'], TypeBadge> = {
  Demandé: 'info',
  Accordé: 'success',
  'En cours': 'new',
  Refusé: 'error',
  Terminé: undefined,
}
</script>

<template>
  <div>
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
        :entetes="['Date', 'Instance', 'Statut', 'Avis de la commission']"
      >
        <tr v-for="c in dossier.commissions" :key="c.date">
          <th scope="row">{{ c.date }}</th>
          <td>{{ c.instance }}</td>
          <td><DsfrBadge small no-icon :label="c.statut" :type="badgeCommission[c.statut]" /></td>
          <td>{{ c.avis ?? '–' }}</td>
        </tr>
      </TableauDsfr>
      <p v-else>Ce dossier n’a été inscrit à aucune réunion.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-calendar-line" label="Inscrire en commission" />
    </section>

    <!-- Diagnostic et dispositifs -->
    <section id="dispositifs" class="fr-mb-8w" aria-labelledby="titre-dispositifs">
      <h2 id="titre-dispositifs" class="fr-h4">Diagnostic et dispositifs</h2>
      <dl class="alexi-grille fr-mb-3w">
        <div>
          <dt class="fr-text--sm fr-mb-1v">Diagnostic social et financier</dt>
          <dd>
            <template v-if="acc.dsf">
              <strong>{{ acc.dsf.statut }}</strong> le {{ acc.dsf.date }}<br />
              <span class="fr-text--sm">par {{ acc.dsf.par }}</span>
            </template>
            <template v-else>Non demandé</template>
          </dd>
        </div>
      </dl>
      <TableauDsfr
        v-if="acc.dispositifs.length"
        titre="Dispositifs mobilisés"
        multiligne
        :entetes="['Dispositif', 'Statut', 'Depuis le', 'Précisions', 'Porteur']"
      >
        <tr v-for="d in acc.dispositifs" :key="d.nom">
          <th scope="row">{{ d.nom }}</th>
          <td><DsfrBadge small no-icon :label="d.statut" :type="badgeDispositif[d.statut]" /></td>
          <td>{{ d.date }}</td>
          <td>{{ d.detail ?? '–' }}</td>
          <td>{{ d.porteur }}</td>
        </tr>
      </TableauDsfr>
      <p v-else>Aucun dispositif mobilisé pour l’instant (FSL, plan d’apurement, ASLL…).</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-add-line" label="Ajouter un dispositif" />
    </section>

    <!-- Intervenants sociaux -->
    <section id="intervenants" aria-labelledby="titre-intervenants">
      <h2 id="titre-intervenants" class="fr-h4">Intervenants sociaux</h2>
      <dl v-if="dossier.contacts.length" class="alexi-grille">
        <div v-for="c in dossier.contacts" :key="c.nom" class="alexi-coupe">
          <dt><strong>{{ c.nom }}</strong></dt>
          <dd class="fr-text--sm fr-mb-0">{{ c.role }}<br />{{ c.contact }}</dd>
        </div>
      </dl>
      <p v-else>Aucun intervenant social n’est rattaché au dossier.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-3w" secondary icon="fr-icon-add-line" label="Ajouter un intervenant" />
    </section>
  </div>
</template>
