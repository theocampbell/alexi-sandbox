<script setup lang="ts">
import { computed } from 'vue'
import { ETAPES, formatEuros, pluriel } from '../data'
import { usePrototype } from '../composables/usePrototype'

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

/** Dernière information connue sur la dette (la plus récente du tableau) */
const derniereDette = computed(() => {
  const e = dossier.value.dette.evolution
  return e[e.length - 1]
})
/** « Commissaire de justice » → « commissaire de justice », sigles conservés (CAF, CCAS…) */
const sourceMinuscule = (s: string) => (/^[A-Z]{2,}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1))

/** Les données de la Synthèse peuvent venir de sources différentes : on les nomme une par une */
const sources = computed(() => {
  const d = dossier.value
  const lignes: string[] = []
  if (d.caf) lignes.push(`Ressources du foyer : CAF, flux reçu le ${d.caf.date}.`)
  lignes.push(`Dette : ${sourceMinuscule(derniereDette.value.origine)}, le ${derniereDette.value.date}.`)
  return lignes
})

/**
 * Détail de la dette : la dernière ligne du tableau de la dette, avec les mêmes libellés,
 * quelle que soit sa source (CAF, commissaire de justice, saisie manuelle).
 */
const detailDette = computed(() => {
  const l = derniereDette.value
  const euros = (n: number | null) => (n === null ? null : formatEuros(n))
  return [
    { libelle: 'Dont loyer', valeur: euros(l.loyer) },
    { libelle: 'Dont charges', valeur: euros(l.charges) },
    { libelle: 'Dont frais annexes', valeur: euros(l.fraisAnnexes) },
    { libelle: 'Part de la dette locative sur l’ensemble des dettes', valeur: l.partSurDettes === null ? null : `${l.partSurDettes} %` },
  ].filter((c) => c.valeur !== null)
})

/** Ressources du foyer : seulement avec des données CAF, mêmes libellés que « Situation du foyer » */
const ressources = computed(() => {
  const c = dossier.value.caf
  if (!c) return []
  return [
    { libelle: 'Loyer mensuel', valeur: c.loyer },
    { libelle: 'Aide au logement', valeur: c.aide },
    { libelle: 'Tiers payant', valeur: c.tiersPayant ? 'Oui' : 'Non' },
  ]
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
  const prochaineCommission = d.commissions.find((c) => c.statut === 'À venir')
  const rows: { libelle: string; valeur: string[] }[] = [
    {
      libelle: 'Logement',
      valeur: principal
        ? [`${principal.titre}, ${principal.ligne2}`, [principal.type, principal.surface].filter(Boolean).join(' · ')]
        : [],
    },
    { libelle: secondaires.length > 1 ? 'Locaux secondaires' : 'Local secondaire', valeur: secondaires.map((l) => l.titre) },
    // Ressources du foyer : données CAF, mêmes libellés que « Situation du foyer »
    ...ressources.value.map((r) => ({ libelle: r.libelle, valeur: [r.valeur] })),
    { libelle: 'Bailleur', valeur: [b.nom, `${b.type} · ${b.nature.toLowerCase()}`, b.contact ?? ''] },
    { libelle: 'Gestionnaire', valeur: b.gestionnaire ? [b.gestionnaire] : [] },
    {
      libelle: 'Commission',
      valeur: prochaineCommission ? [`Réunion du ${prochaineCommission.date}`, `${prochaineCommission.instance}, ${prochaineCommission.heure}`] : [],
    },
    { libelle: 'Commissaire de justice', valeur: d.cj ? [d.cj.nom, d.cj.contact] : [] },
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
          <p class="fr-h2 fr-mb-0">{{ formatEuros(dossier.dette.montant) }}</p>
          <p v-if="dossier.dette.mois">soit <strong>{{ dossier.dette.mois }} mois</strong> de loyer</p>
          <p v-if="dossier.dette.anciennete">impayée depuis <strong>{{ dossier.dette.anciennete }}</strong></p>
          <!-- Détail : dernière ligne du tableau de la dette, mêmes libellés -->
          <dl v-if="detailDette.length" class="alexi-detail fr-text--sm">
            <div v-for="c in detailDette" :key="c.libelle">
              <dt>{{ c.libelle }}</dt>
              <dd>{{ c.valeur }}</dd>
            </div>
          </dl>
          <RouterLink class="fr-link fr-icon-arrow-right-line fr-link--icon-right alexi-bas" :to="lien('informations')">
            Voir le détail de la dette
          </RouterLink>
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
          <RouterLink class="fr-link fr-icon-arrow-right-line fr-link--icon-right alexi-bas" :to="lien('informations')">
            Voir les occupants
          </RouterLink>
        </section>
      </div>
    </div>


    <!-- 2. Une seule liste, sans encadré -->
    <section class="fr-mt-8w" aria-labelledby="titre-acteurs">
      <h2 id="titre-acteurs" class="fr-h4 fr-mb-3w">Logement, ressources et acteurs</h2>
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
    </section>

    <!-- 3. Une seule mention des sources, en précisant la source de chaque donnée -->
    <p class="fr-text--xs fr-mt-8w fr-mb-0">
      <strong>Sources</strong>
      <template v-for="l in sources" :key="l"><br />{{ l }}</template>
    </p>
  </div>
</template>
