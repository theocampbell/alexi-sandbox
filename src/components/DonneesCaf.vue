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
    {
      titre: 'Prestations sociales',
      indicateurs: props.caf.prestations.map((p) => ({ ...p, libelle: p.sigle ? `${p.libelle} (${p.sigle})` : p.libelle })),
    },
  ].filter((g) => g.indicateurs.length),
)

/** Prestations perçues, affichées en clair au-dessus de l'accordéon */
const percues = computed(() => props.caf.prestations.filter((p) => p.valeur === 'Oui'))

/** Titres selon ce que contient le flux CAF */
const titreBloc = computed(() => {
  const a = props.caf.autres.length > 0
  const p = props.caf.prestations.length > 0
  return a && p ? 'Autres indicateurs et prestations sociales' : a ? 'Autres indicateurs de la situation du foyer' : 'Prestations sociales'
})
const titreAccordeon = computed(() => {
  const a = props.caf.autres.length
  const p = props.caf.prestations.length
  const quoi = a && p ? 'des indicateurs et prestations' : a ? 'des indicateurs' : 'des prestations'
  return `Voir le détail ${quoi} (${a + p})`
})

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

    <!--
      Autres indicateurs et prestations sociales : un seul bloc, résumé en clair (badges, prestations perçues)
      puis un seul accordéon en dernier, qui ferme l'encadré. Titres adaptés à ce qui est présent.
    -->
    <template v-if="caf.autres.length || caf.prestations.length">
      <h3 class="fr-h6 fr-mt-2w fr-mb-1w">{{ titreBloc }}</h3>
      <template v-if="caf.autres.length">
        <ul v-if="signales.length" class="fr-badges-group fr-mb-1w">
          <li v-for="s in signales" :key="s"><DsfrBadge :label="s" type="warning" small /></li>
        </ul>
        <p v-else class="fr-mb-1w">Aucun signalement CAF sur les {{ caf.autres.length }} indicateurs.</p>
      </template>
      <p v-if="caf.prestations.length" class="fr-mb-1w">
        <template v-if="percues.length">
          Prestations perçues :
          <template v-for="(p, i) in percues" :key="p.libelle"
            ><template v-if="i > 0">, </template><strong><abbr :title="p.libelle">{{ p.sigle ?? p.libelle }}</abbr></strong></template
          >
        </template>
        <template v-else>Aucune prestation sociale perçue.</template>
      </p>
      <DsfrAccordion :title="titreAccordeon" title-tag="h4">
        <!-- Une liste par thème, une ligne par élément : libellé à gauche, valeur à droite -->
        <!-- Marge intérieure : l'accordéon coupe ce qui touche ses bords -->
        <div class="fr-px-1w">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div v-for="g in groupes" :key="g.titre" :class="['fr-col-12', groupes.length > 2 ? 'fr-col-md-4' : 'fr-col-md-6']">
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
  </section>
</template>
