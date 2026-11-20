<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pluriel } from '../data'
import { usePrototype } from '../composables/usePrototype'
import TableauDsfr from '../components/TableauDsfr.vue'
import DetteTableau from '../components/DetteTableau.vue'
import DonneesCaf from '../components/DonneesCaf.vue'

const route = useRoute()
const { dossier, peutModifier, procedureEnCours } = usePrototype()

const mineurs = computed(() => dossier.value.occupants.filter((o) => o.age !== null && o.age < 18))
const entetesOccupants = computed(() =>
  ['Identité', 'Naissance', 'Rôle', 'Coordonnées', 'Activité'].concat(peutModifier.value ? ['Actions'] : []),
)
const b = computed(() => dossier.value.bailleur)
/** Lignes du tableau du commissaire de justice, dans l'ordre de l'application */
const rolesCj = computed(() => {
  const cj = dossier.value.cj
  if (!cj) return []
  return [
    ...(cj.responsable ? [{ role: 'Responsable de dossier (étude de commissaires)', personne: cj.responsable }] : []),
    { role: 'Commissaire de justice', personne: cj.commissaire },
  ]
})
/** Entrées du menu latéral : seulement les sections affichées */
const menu = computed(() => {
  const d = dossier.value
  const sections: [string, string, boolean][] = [
    ['occupants', 'Occupants', true],
    ['dette', 'Dette locative', true],
    ['caf', 'Données CAF', !!d.caf],
    ['locaux', 'Locaux', true],
    ['bailleur', 'Bailleur', true],
    ['mandat', 'Mandat de gestion', !!d.bailleur.mandat],
    ['contacts', 'Contacts', true],
    ['commissaire', 'Commissaire de justice', !!d.cj],
  ]
  return sections
    .filter(([, , present]) => present)
    .map(([id, text]) => ({
      text,
      to: { name: 'informations', params: route.params, query: route.query, hash: `#${id}` },
      active: route.hash === `#${id}`,
    }))
})

const lienSiret = (siret: string) => `https://annuaire-entreprises.data.gouv.fr/etablissement/${siret.replace(/\s/g, '')}`
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <!-- Menu latéral : une entrée par section présente ; replié nativement sur mobile -->
    <div class="fr-col-12 fr-col-md-3">
      <DsfrSideMenu
        class="fr-sidemenu--sticky"
        button-label="Dans cet onglet"
        heading-title="Dans cet onglet"
        title-tag="h2"
        :menu-items="menu"
      />
    </div>
    <div class="fr-col-12 fr-col-md-9">
    <!-- Occupants -->
    <section id="occupants" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-occupants">
      <h2 id="titre-occupants" class="fr-h4">Occupants</h2>
      <p>
        {{ pluriel(dossier.occupants.length, 'occupant') }}<template v-if="mineurs.length">
          dont {{ pluriel(mineurs.length, 'mineur') }}</template
        >.
      </p>
      <TableauDsfr titre="Liste des occupants" :entetes="entetesOccupants">
        <tr v-for="o in dossier.occupants" :key="o.nom">
          <td class="alexi-coupe">
            <strong v-if="o.titulaire">{{ o.nom }}</strong>
            <template v-else>{{ o.nom }}</template>
          </td>
          <td>
            <template v-if="o.naissance">{{ o.naissance }}<br /></template>
            <template v-if="o.age !== null">{{ o.age }} ans</template>
            <template v-else>Non renseigné</template>
          </td>
          <td>
            {{ o.role }}
            <template v-if="o.detail"><br /><span class="fr-text--sm">{{ o.detail }}</span></template>
          </td>
          <td>{{ o.coord ?? 'Non renseigné' }}</td>
          <td>{{ o.activite ?? 'Non renseigné' }}</td>
          <td v-if="peutModifier">
            <div class="alexi-actions">
              <DsfrButton tertiary size="sm" icon="fr-icon-edit-line" icon-only :label="`Modifier ${o.nom}`" />
              <DsfrButton tertiary size="sm" icon="fr-icon-delete-line" icon-only :label="`Supprimer ${o.nom}`" />
            </div>
          </td>
        </tr>
      </TableauDsfr>
      <!-- fr-btns-group--icon-left : sans elle, le DSFR traite les boutons à icône d'un groupe comme des boutons icône seule -->
      <DsfrButtonGroup
        v-if="peutModifier"
        class="fr-mt-2w fr-btns-group--icon-left"
        inline-layout-when="md"
        :buttons="[
          { label: 'Ajouter un occupant', secondary: true, icon: 'fr-icon-add-line' },
          { label: 'Signaler une vulnérabilité', secondary: true, icon: 'fr-icon-warning-line' },
        ]"
      />
      <DsfrAccordion v-if="dossier.occupantsPartis.length" class="fr-mt-2w" :title="`Occupants ayant quitté le logement (${dossier.occupantsPartis.length})`">
        <ul class="fr-mb-0">
          <li v-for="o in dossier.occupantsPartis" :key="o.nom">{{ o.nom }} · {{ o.role }}</li>
        </ul>
      </DsfrAccordion>
    </section>

    <!-- Dette locative : toutes les informations reçues ou saisies -->
    <section id="dette" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-dette-info">
      <h2 id="titre-dette-info" class="fr-h4 fr-mb-1w">Dette locative</h2>
      <!-- La dette est liée à la procédure en cours ; celle des procédures closes est dans l'onglet Procédure -->
      <p class="fr-text--sm">
        <template v-if="procedureEnCours">
          Procédure en cours : {{ procedureEnCours.motif }}, depuis le {{ procedureEnCours.depuis }}
        </template>
        <template v-else>Aucune procédure en cours</template>
      </p>
      <DetteTableau :points="dossier.dette.evolution" />
      <DsfrButton
        v-if="peutModifier"
        class="fr-mt-2w"
        secondary
        icon="fr-icon-add-line"
        label="Ajouter une information sur la dette"
      />
    </section>

    <!-- Données CAF : uniquement avec un signalement CAF (bloc en lecture seule) -->
    <DonneesCaf v-if="dossier.caf" :caf="dossier.caf" />

    <!-- Locaux -->
    <section id="locaux" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-locaux">
      <h2 id="titre-locaux" class="fr-h4">Locaux</h2>
      <!-- Tableau, comme dans l'application : mêmes colonnes, actions sur chaque ligne -->
      <TableauDsfr titre="Liste des locaux" :entetes="['Type', 'Caractérisation', 'Adresse'].concat(peutModifier ? ['Actions'] : [])">
        <tr v-for="l in dossier.locaux" :key="l.titre">
          <td>{{ l.type }}</td>
          <td>{{ l.principal ? 'Local principal' : 'Local secondaire' }}</td>
          <td class="alexi-coupe">{{ l.titre }}<br />{{ l.ligne2 }}</td>
          <td v-if="peutModifier">
            <div class="alexi-actions">
              <DsfrButton tertiary size="sm" icon="fr-icon-edit-line" icon-only :label="`Modifier le local ${l.titre}`" />
              <!-- Le local principal ne se supprime pas -->
              <DsfrButton
                v-if="!l.principal"
                tertiary
                size="sm"
                icon="fr-icon-delete-line"
                icon-only
                :label="`Supprimer le local ${l.titre}`"
              />
            </div>
          </td>
        </tr>
      </TableauDsfr>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-add-line" label="Ajouter un local" />
    </section>

    <!-- Bailleur -->
    <section id="bailleur" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-bailleur">
      <h2 id="titre-bailleur" class="fr-h4">Bailleur</h2>
      <p v-if="b.depuis" class="fr-text--sm">Bailleur actuel depuis le {{ b.depuis }}</p>
      <!-- Tableau, comme dans l'application : mêmes colonnes, action sur la ligne -->
      <TableauDsfr
        titre="Bailleur actuel"
        :entetes="['Type', 'Nature', 'Identité', 'Adresse', 'Contact'].concat(peutModifier ? ['Actions'] : [])"
      >
        <tr>
          <td>{{ b.type }}</td>
          <td>{{ b.nature }}</td>
          <td class="alexi-coupe">
            {{ b.nom }}
            <span v-if="b.siret" class="fr-text--sm alexi-bloc">
              SIRET
              <a
                :href="lienSiret(b.siret)"
                target="_blank"
                rel="noopener"
                :title="`${b.siret} sur l’annuaire des entreprises - nouvelle fenêtre`"
              >{{ b.siret }}</a>
            </span>
          </td>
          <td>
            <template v-if="b.adresse">{{ b.adresse[0] }}<br />{{ b.adresse[1] }}</template>
            <template v-else>Non renseigné</template>
          </td>
          <td class="alexi-coupe">{{ b.contact ?? 'Non renseigné' }}</td>
          <td v-if="peutModifier">
            <div class="alexi-actions">
              <DsfrButton tertiary size="sm" icon="fr-icon-edit-line" icon-only :label="`Corriger les informations du bailleur ${b.nom}`" />
            </div>
          </td>
        </tr>
      </TableauDsfr>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-refresh-line" label="Changer de bailleur" />

      <DsfrAccordion v-if="b.precedents.length" class="fr-mt-2w" :title="`Bailleurs précédents (${b.precedents.length})`">
        <ul class="fr-mb-0">
          <li v-for="p in b.precedents" :key="p.nom"><strong>{{ p.nom }}</strong> · {{ p.detail }} · {{ p.periode }}</li>
        </ul>
      </DsfrAccordion>
    </section>

    <!-- Mandat de gestion : pas de titre quand il n'y a ni donnée ni moyen d'en ajouter -->
    <section v-if="b.mandat" id="mandat" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-mandat">
      <h2 id="titre-mandat" class="fr-h4">Mandat de gestion</h2>
      <p><strong>{{ b.mandat.gestionnaire }}</strong>, mandat de gestion depuis le {{ b.mandat.depuis }}</p>
    </section>

    <!-- Contacts -->
    <section id="contacts" tabindex="-1" class="fr-mb-8w" aria-labelledby="titre-contacts">
      <h2 id="titre-contacts" class="fr-h4">Contacts</h2>
      <TableauDsfr
        v-if="dossier.contacts.length"
        titre="Liste des contacts"
        :entetes="['Identité', 'Rôle', 'Téléphone', 'Adresse électronique'].concat(peutModifier ? ['Actions'] : [])"
      >
        <tr v-for="c in dossier.contacts" :key="c.nom">
          <td class="alexi-coupe">{{ c.nom }}</td>
          <td>{{ c.role }}</td>
          <td>{{ c.telephone ?? 'Non renseigné' }}</td>
          <td class="alexi-coupe">{{ c.email ?? 'Non renseigné' }}</td>
          <td v-if="peutModifier">
            <div class="alexi-actions">
              <DsfrButton tertiary size="sm" icon="fr-icon-edit-line" icon-only :label="`Modifier ${c.nom}`" />
              <DsfrButton tertiary size="sm" icon="fr-icon-delete-line" icon-only :label="`Supprimer ${c.nom}`" />
            </div>
          </td>
        </tr>
      </TableauDsfr>
      <p v-else>Aucun contact n’a été renseigné.</p>
      <p class="fr-text--sm fr-mt-3w fr-mb-0">L’organisme d’accompagnement sociojuridique est indiqué dans l’onglet Accompagnement.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-3w" secondary icon="fr-icon-add-line" label="Ajouter un contact" />
    </section>

    <!-- Commissaire de justice : comme dans l'application, responsable à l'étude puis commissaire, sans action.
         Pas de titre quand il n'y en a pas (aucun moyen d'en ajouter ici). -->
    <section v-if="dossier.cj" id="commissaire" tabindex="-1" aria-labelledby="titre-commissaire">
      <h2 id="titre-commissaire" class="fr-h4">Commissaire de justice</h2>
      <TableauDsfr titre="Commissaire de justice et responsable du dossier à l’étude" :entetes="['Rôle', 'Identité', 'Téléphone', 'Adresse électronique']">
        <tr v-for="r in rolesCj" :key="r.role">
          <td>{{ r.role }}</td>
          <td class="alexi-coupe">{{ r.personne.nom }}</td>
          <td>{{ r.personne.telephone ?? 'Non renseigné' }}</td>
          <td class="alexi-coupe">{{ r.personne.email ?? 'Non renseigné' }}</td>
        </tr>
      </TableauDsfr>
    </section>
    </div>
  </div>
</template>
