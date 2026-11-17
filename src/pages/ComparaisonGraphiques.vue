<script setup lang="ts">
/**
 * Page de travail (hors maquette) : compare trois façons de dessiner l'évolution de la dette.
 */
import '@gouvfr/dsfr-chart/BarChart'
import '@gouvfr/dsfr-chart/BarChart/css'
import { ETATS, type PointDette } from '../data'
import DetteCourbeSvg from '../components/DetteCourbeSvg.vue'

document.title = 'Comparaison des graphiques de la dette – Alexi (prototype)'

const exemples: { titre: string; description: string; points: PointDette[] }[] = [
  {
    titre: 'Exemple 1 · procédure avancée',
    description: 'Les données du dossier « Procédure avancée » : écarts de 2 à 7 mois, deux montants identiques à la fin.',
    points: ETATS.avance.dette!.evolution,
  },
  {
    titre: 'Exemple 2 · dates rapprochées et baisse',
    description: 'Deux mises à jour à 15 jours d’écart, puis une baisse de la dette après une aide du FSL.',
    points: [
      { origine: 'CAF', date: '1er mars 2026', montant: 800, loyer: 800, charges: 0, fraisAnnexes: null, partSurDettes: null },
      { origine: 'Commissaire de justice', date: '15 mars 2026', montant: 950, loyer: 800, charges: 0, fraisAnnexes: 150, partSurDettes: null },
      { origine: 'Bailleur', date: '1er sept. 2026', montant: 2600, loyer: 2300, charges: 150, fraisAnnexes: 150, partSurDettes: null },
      { origine: 'Saisie manuelle', date: '10 oct. 2026', montant: 1900, loyer: 1600, charges: 150, fraisAnnexes: 150, partSurDettes: 60 },
    ],
  },
]

const x = (p: PointDette[]) => JSON.stringify([p.map((d) => d.date)])
const y = (p: PointDette[]) => JSON.stringify([p.map((d) => d.montant)])

const variantes = [
  { id: 'a', titre: 'A · Courbe DSFR Chart', note: 'Composant officiel. Courbe lissée, dates espacées régulièrement, axe en « K ».' },
  { id: 'b', titre: 'B · Barres DSFR Chart', note: 'Composant officiel. Une barre par mise à jour, pas de lissage ; dates espacées régulièrement, axe en « K ».' },
  { id: 'c', titre: 'C · Courbe SVG simple', note: 'Fait maison, aux couleurs DSFR. Segments droits, dates à leur vraie place, montants en euros.' },
]
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
    <h1 class="fr-h2">Comparaison des graphiques de la dette</h1>
    <p>
      Page de travail, hors maquette : les mêmes données dessinées de trois façons. Dans la page dossier, le graphique
      s’affiche dans la Synthèse à partir de 2 montants.
    </p>
    <p>
      <RouterLink class="fr-link fr-icon-arrow-left-line fr-link--icon-left" to="/">Retour au dossier</RouterLink>
    </p>

    <section v-for="v in variantes" :key="v.id" class="fr-mt-6w" :aria-labelledby="`titre-${v.id}`">
      <h2 :id="`titre-${v.id}`" class="fr-h4 fr-mb-1w">{{ v.titre }}</h2>
      <p class="fr-text--sm">{{ v.note }}</p>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-for="e in exemples" :key="e.titre" class="fr-col-12 fr-col-md-6">
          <h3 class="fr-h6 fr-mb-1w">{{ e.titre }}</h3>
          <p class="fr-text--xs">{{ e.description }}</p>
          <div v-if="v.id === 'a'" role="img" :aria-label="`${v.titre}, ${e.titre}`">
            <line-chart :x="x(e.points)" :y="y(e.points)" name='["Dette locative"]' unit-tooltip="€" y-min="0" selected-palette="default" />
          </div>
          <div v-else-if="v.id === 'b'" role="img" :aria-label="`${v.titre}, ${e.titre}`">
            <bar-chart :x="x(e.points)" :y="y(e.points)" name='["Dette locative"]' unit-tooltip="€" selected-palette="default" />
          </div>
          <DetteCourbeSvg v-else :points="e.points" />
        </div>
      </div>
    </section>
  </div>
</template>
