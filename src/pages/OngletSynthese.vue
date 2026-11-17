<script setup lang="ts">
import { computed } from 'vue'
import { ETAPES, formatEuros, pluriel } from '../data'
import { usePrototype } from '../composables/usePrototype'
import DetteEvolution from '../components/DetteEvolution.vue'

const { dossier, procedureEnCours, lien } = usePrototype()

const etapes = [...ETAPES]

const mineurs = computed(() => dossier.value.occupants.filter((o) => o.age !== null && o.age < 18))
const titulaires = computed(() => dossier.value.occupants.filter((o) => o.titulaire))

/** « 14 et 12 ans », « 15, 13 et 11 ans » */
const agesMineurs = computed(() => {
  const ages = mineurs.value.map((o) => o.age)
  if (ages.length > 3 || ages.length === 0) return ''
  return `${ages.length > 1 ? ages.slice(0, -1).join(', ') + ' et ' : ''}${ages[ages.length - 1]} ans`
})

/*
 * Liste unique libellé · valeur. Une ligne vide n'est pas affichée.
 * Chaque valeur est une liste de lignes (la première en gras).
 */
const lignes = computed(() => {
  const d = dossier.value
  const principal = d.locaux.find((l) => l.principal)
  const secondaires = d.locaux.filter((l) => !l.principal)
  const b = d.bailleur
  const prochaineCommission = d.commissions.find((c) => c.statut === 'Inscrit')
  const acc = d.accompagnement
  const rows: { libelle: string; valeur: string[] }[] = [
    {
      libelle: 'Logement',
      valeur: principal
        ? [`${principal.titre}, ${principal.ligne2}`, [principal.type, principal.surface].filter(Boolean).join(' · ')]
        : [],
    },
    { libelle: secondaires.length > 1 ? 'Locaux secondaires' : 'Local secondaire', valeur: secondaires.map((l) => l.titre) },
    { libelle: 'Bailleur', valeur: [b.nom, `${b.type} · ${b.nature.toLowerCase()}`, b.contact ?? ''] },
    { libelle: 'Gestionnaire', valeur: b.gestionnaire ? [b.gestionnaire] : [] },
    {
      libelle: 'Commission',
      valeur: prochaineCommission ? [`${prochaineCommission.instance} · ${prochaineCommission.date}`, 'prochain passage'] : [],
    },
    { libelle: 'Commissaire de justice', valeur: d.cj ? [d.cj.nom, d.cj.contact] : [] },
    {
      libelle: 'Accompagnement',
      valeur: [
        ...(acc.dsf ? [`Diagnostic social et financier ${acc.dsf.statut.toLowerCase()} le ${acc.dsf.date}`] : []),
        ...acc.dispositifs.map((x) => `${x.nom} · ${x.statut.toLowerCase()}`),
      ],
    },
    { libelle: 'Intervenants sociaux', valeur: d.contacts.map((c) => `${c.nom} · ${c.role}`) },
  ]
  return rows
    .map((r) => ({ ...r, valeur: r.valeur.filter(Boolean) }))
    .filter((r) => r.valeur.length > 0)
})
</script>

<template>
  <div>
    <!-- 1. Trois cartes : les seuls blocs encadrés de la Synthèse -->
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-4">
        <section class="alexi-carte" aria-labelledby="carte-procedure">
          <template v-if="procedureEnCours && procedureEnCours.etape !== null">
            <p id="carte-procedure" class="fr-text--sm fr-mb-0">
              Procédure en cours · <strong>{{ procedureEnCours.motif }}</strong>
            </p>
            <DsfrStepper class="fr-mb-0" :steps="etapes" :current-step="procedureEnCours.etape + 1" />
            <p v-if="procedureEnCours.prochaine" class="fr-text--sm">
              <strong>À venir :</strong> {{ procedureEnCours.prochaine }}
            </p>
            <RouterLink class="fr-link fr-icon-arrow-right-line fr-link--icon-right alexi-bas" :to="lien('procedure')">
              Ouvrir la procédure
            </RouterLink>
          </template>
          <template v-else>
            <h2 id="carte-procedure" class="fr-h6">Procédure</h2>
            <p>Aucune procédure en cours</p>
          </template>
        </section>
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <section class="alexi-carte" aria-labelledby="carte-dette">
          <h2 id="carte-dette" class="fr-h6">Dette locative</h2>
          <template v-if="dossier.dette">
            <p class="fr-h2 fr-mb-0">{{ formatEuros(dossier.dette.montant) }}</p>
            <p>soit <strong>{{ dossier.dette.mois }} mois</strong> de loyer</p>
            <p>impayée depuis <strong>{{ dossier.dette.anciennete }}</strong></p>
          </template>
          <template v-else>
            <p class="fr-h4 fr-mb-0">Montant inconnu</p>
            <p>Ni la CAF ni le commissaire de justice n’ont transmis de montant.</p>
          </template>
        </section>
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <section class="alexi-carte" aria-labelledby="carte-menage">
          <h2 id="carte-menage" class="fr-h6">Ménage</h2>
          <p class="fr-h2 fr-mb-0">{{ pluriel(dossier.occupants.length, 'occupant') }}</p>
          <p v-if="mineurs.length">
            dont <strong>{{ pluriel(mineurs.length, 'mineur') }}</strong>
            <template v-if="agesMineurs"> ({{ agesMineurs }})</template>
          </p>
          <p v-else>Aucun mineur déclaré</p>
          <p class="alexi-coupe">
            <template v-if="titulaires.length">
              {{ titulaires.length > 1 ? 'Titulaires du bail' : 'Titulaire du bail' }} :
              {{ titulaires.map((t) => t.nom).join(' et ') }}
            </template>
            <template v-else>Titulaire du bail non renseigné</template>
          </p>
          <RouterLink
            class="fr-link fr-icon-arrow-right-line fr-link--icon-right alexi-bas"
            :to="lien('informations')"
          >
            Voir les occupants
          </RouterLink>
        </section>
      </div>
    </div>

    <!-- 2. Dette et ressources -->
    <section class="fr-mt-8w" aria-labelledby="titre-dette">
      <h2 id="titre-dette" class="fr-h4 fr-mb-3w">Dette et ressources</h2>
      <template v-if="dossier.dette">
        <dl class="alexi-grille">
          <div>
            <dt class="fr-text--sm fr-mb-1v">Loyer mensuel</dt>
            <dd class="fr-text--lg fr-text--bold fr-mb-0">{{ dossier.dette.loyer }}</dd>
          </div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">Charges mensuelles</dt>
            <dd class="fr-text--lg fr-text--bold fr-mb-0">{{ dossier.dette.charges }}</dd>
          </div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">Aide au logement</dt>
            <dd class="fr-text--lg fr-mb-0">
              <strong>{{ dossier.dette.aide }}</strong>
              <span class="fr-text--sm"> · {{ dossier.dette.tiersPayant ? 'en tiers payant' : 'sans tiers payant' }}</span>
            </dd>
          </div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">Reste à charge estimé</dt>
            <dd class="fr-text--lg fr-mb-0"><strong>{{ dossier.dette.reste }}</strong><span class="fr-text--sm"> par mois</span></dd>
          </div>
        </dl>

        <!-- Graphique seulement à partir de 2 montants -->
        <DetteEvolution v-if="dossier.dette.evolution.length >= 2" class="fr-mt-6w" :points="dossier.dette.evolution" />
      </template>
      <p v-else>Aucune donnée sur la dette ni sur les ressources du foyer.</p>
    </section>

    <!-- 3. Une seule liste, sans encadré -->
    <section class="fr-mt-8w" aria-labelledby="titre-acteurs">
      <h2 id="titre-acteurs" class="fr-h4 fr-mb-3w">Logement et acteurs</h2>
      <dl class="alexi-liste">
        <div v-for="l in lignes" :key="l.libelle">
          <dt>{{ l.libelle }}</dt>
          <dd class="alexi-coupe">
            <template v-for="(v, i) in l.valeur" :key="i">
              <br v-if="i > 0" />
              <strong v-if="i === 0">{{ v }}</strong>
              <span v-else class="fr-text--sm">{{ v }}</span>
            </template>
          </dd>
        </div>
      </dl>
      <p class="fr-mt-3w">
        <RouterLink class="fr-link fr-icon-arrow-right-line fr-link--icon-right" :to="lien('informations')">
          Toutes les informations du dossier
        </RouterLink>
      </p>
    </section>

    <!-- 4. Une seule mention des sources -->
    <p v-if="dossier.caf" class="fr-text--xs fr-mt-8w fr-mb-0">Sources : CAF, flux reçu le {{ dossier.caf.date }}</p>
  </div>
</template>
