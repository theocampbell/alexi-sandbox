<script setup lang="ts">
/**
 * Section « Données CAF » de l'onglet Informations : données reçues de la CAF, en lecture seule.
 * Fond gris et aucun bouton, pour la distinguer des tableaux modifiables.
 * Chaque bloc (titre compris) n'est affiché que si ses données existent.
 */
import { computed } from 'vue'
import { formatEuros, type Caf } from '../data'
import ValeurCaf from './ValeurCaf.vue'

/** « Reste à charge » (loyer − aide nette) : en attente de validation métier */
const SHOW_RESTE_A_CHARGE = false

const props = defineProps<{ caf: Caf }>()

/** « 561,39 € » → 561.39 */
const euros = (v: string | null) => (v === null ? null : Number(v.replace(/[^\d,]/g, '').replace(',', '.')))

/** Chiffres clés de la situation du foyer */
const chiffres = computed(() => {
  const c = props.caf
  const aide = `${c.typeAide ?? 'Aide au logement'} nette${c.tiersPayant ? ' · tiers payant' : ''}`
  const liste = [
    { libelle: 'Dernier loyer connu', valeur: c.loyer },
    { libelle: aide, valeur: c.montantAide },
    { libelle: 'Surface', valeur: c.surface },
  ]
  const loyer = euros(c.loyer)
  const montant = euros(c.montantAide)
  if (SHOW_RESTE_A_CHARGE && loyer !== null && montant !== null) {
    liste.push({ libelle: 'Reste à charge', valeur: formatEuros(loyer - montant) })
  }
  return liste
})

/** Indicateurs signalés (« Oui ») : affichés en badges */
const signales = computed(() =>
  props.caf.autres
    .filter((i) => i.valeur === 'Oui')
    .map((i) => {
      // Grossesse : la date de début accompagne le badge
      const date = i.precisions?.find((p) => p.libelle === 'Date de début de grossesse')?.valeur
      return date ? `${i.libelle} (début le ${date})` : i.libelle
    }),
)

/** Indicateurs regroupés par thème (les indicateurs inconnus vont dans « Situation du ménage ») */
const LOGEMENT = ['Fin de l’occupation', 'Insalubrité', 'Péril', 'Surpeuplement', 'Non décence', 'Colocation']
const groupes = computed(() =>
  [
    { titre: 'Logement', indicateurs: props.caf.autres.filter((i) => LOGEMENT.includes(i.libelle)) },
    { titre: 'Situation du ménage', indicateurs: props.caf.autres.filter((i) => !LOGEMENT.includes(i.libelle)) },
  ].filter((g) => g.indicateurs.length),
)

</script>

<template>
  <section id="caf" class="fr-background-alt--grey fr-p-3w fr-mb-8w" aria-labelledby="titre-caf">
    <h2 id="titre-caf" class="fr-h4 fr-mb-1w">Données CAF</h2>
    <p class="fr-text--sm fr-text-mention--grey fr-mb-2w">
      Allocataire n° {{ caf.matricule }} · Organisme {{ caf.organisme }} · Mis à jour le {{ caf.miseAJourDate }} à
      {{ caf.miseAJourHeure }}
    </p>

    <!-- Situation foyer : toujours présente -->
    <h3 class="fr-h6 fr-mb-1w">Situation foyer</h3>
    <dl class="fr-grid-row fr-grid-row--gutters alexi-dl">
      <!-- Quarts quand « Reste à charge » est affiché, tiers sinon (le libellé de l'aide tient sur une ligne) -->
      <div v-for="c in chiffres" :key="c.libelle" :class="['fr-col-6', chiffres.length > 3 ? 'fr-col-md-3' : 'fr-col-md-4']">
        <dt class="fr-text--xs fr-mb-0">{{ c.libelle }}</dt>
        <dd class="fr-text--lead fr-text--bold fr-mb-0"><ValeurCaf :valeur="c.valeur" /></dd>
      </div>
    </dl>

    <!-- Autres indicateurs : badges pour les « Oui », détail dans un accordéon fermé -->
    <template v-if="caf.autres.length">
      <h3 class="fr-h6 fr-mt-2w fr-mb-1w">Autres indicateurs de la situation du foyer</h3>
      <ul v-if="signales.length" class="fr-badges-group fr-mb-1w">
        <li v-for="s in signales" :key="s"><DsfrBadge :label="s" type="warning" small /></li>
      </ul>
      <p v-else class="fr-mb-1w">Aucun signalement CAF sur les {{ caf.autres.length }} indicateurs.</p>
      <DsfrAccordion :title="`Voir le détail des indicateurs (${caf.autres.length})`" title-tag="h4">
        <!-- Deux groupes thématiques, une ligne par indicateur : libellé à gauche, valeur à droite -->
        <!-- Marge intérieure : l'accordéon coupe ce qui touche ses bords -->
        <div class="fr-px-1w">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div v-for="g in groupes" :key="g.titre" class="fr-col-12 fr-col-md-6">
            <h5 class="fr-text--sm fr-text--bold fr-mb-1w">{{ g.titre }}</h5>
            <dl class="alexi-indicateurs fr-text--sm fr-mb-0">
              <div v-for="ind in g.indicateurs" :key="ind.libelle" class="alexi-indicateurs__ligne">
                <dt>{{ ind.libelle }}</dt>
                <dd :class="{ 'fr-text--bold': ind.valeur === 'Oui' }"><ValeurCaf :valeur="ind.valeur" /></dd>
                <!-- Précisions (tuteur, date de grossesse) seulement quand l'indicateur est « Oui » -->
                <template v-if="ind.valeur === 'Oui'">
                  <dd v-for="pr in ind.precisions ?? []" :key="pr.libelle" class="alexi-indicateurs__precision">
                    {{ pr.libelle }} : <ValeurCaf :valeur="pr.valeur" />
                  </dd>
                </template>
              </div>
            </dl>
          </div>
        </div>
        </div>
      </DsfrAccordion>
    </template>

    <!-- Prestations sociales : même liste que le détail des indicateurs (une ligne par prestation, valeur à droite) -->
    <template v-if="caf.prestations.length">
      <h3 class="fr-h6 fr-mt-2w fr-mb-1w">Prestations sociales</h3>
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-md-6">
          <dl class="alexi-indicateurs fr-text--sm fr-mb-0">
            <div v-for="p in caf.prestations" :key="p.libelle" class="alexi-indicateurs__ligne">
              <dt>{{ p.libelle }}<template v-if="p.sigle"> ({{ p.sigle }})</template></dt>
              <dd :class="{ 'fr-text--bold': p.valeur === 'Oui' }"><ValeurCaf :valeur="p.valeur" /></dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
  </section>
</template>
