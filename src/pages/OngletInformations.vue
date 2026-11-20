<script setup lang="ts">
import { computed } from 'vue'
import { pluriel } from '../data'
import { usePrototype } from '../composables/usePrototype'
import TableauDsfr from '../components/TableauDsfr.vue'
import DetteTableau from '../components/DetteTableau.vue'

const { dossier, peutModifier, procedureEnCours } = usePrototype()

const mineurs = computed(() => dossier.value.occupants.filter((o) => o.age !== null && o.age < 18))
const entetesOccupants = computed(() =>
  ['Identité', 'Naissance', 'Rôle', 'Coordonnées', 'Activité'].concat(peutModifier.value ? ['Actions'] : []),
)
const b = computed(() => dossier.value.bailleur)
/** « - » de la CAF ou valeur absente → « Non renseigné » */
const nr = (v: string | null) => v ?? 'Non renseigné'
const ouiNon = (v: boolean | null) => (v === null ? 'Non renseigné' : v ? 'Oui' : 'Non')
/** Lignes du tableau du commissaire de justice, dans l'ordre de l'application */
const rolesCj = computed(() => {
  const cj = dossier.value.cj
  if (!cj) return []
  return [
    ...(cj.responsable ? [{ role: 'Responsable de dossier (étude de commissaires)', personne: cj.responsable }] : []),
    { role: 'Commissaire de justice', personne: cj.commissaire },
  ]
})
const lienSiret = (siret: string) => `https://annuaire-entreprises.data.gouv.fr/etablissement/${siret.replace(/\s/g, '')}`
</script>

<template>
  <div>
    <!-- Occupants -->
    <section id="occupants" class="fr-mb-8w" aria-labelledby="titre-occupants">
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
      <DsfrAccordion class="fr-mt-2w" :title="`Occupants ayant quitté le logement (${dossier.occupantsPartis.length})`">
        <ul v-if="dossier.occupantsPartis.length" class="fr-mb-0">
          <li v-for="o in dossier.occupantsPartis" :key="o.nom">{{ o.nom }} · {{ o.role }}</li>
        </ul>
        <p v-else class="fr-mb-0">Aucun occupant n’a quitté le logement.</p>
      </DsfrAccordion>
    </section>

    <!-- Données CAF : uniquement quand le dossier vient d'un signalement CAF. Libellés et ordre de l'application. -->
    <section v-if="dossier.caf" id="caf" class="fr-mb-8w" aria-labelledby="titre-caf">
      <h2 id="titre-caf" class="fr-h4 fr-mb-1w">Données CAF</h2>
      <p class="fr-text--sm fr-mb-4w">Dernière mise à jour le {{ dossier.caf.miseAJour }}</p>

      <h3 class="fr-h6 fr-mb-2w">Données spécifiques CAF</h3>
      <dl class="alexi-grille fr-mb-4w">
        <div><dt class="fr-text--sm fr-mb-1v">Matricule d’allocataire CAF</dt><dd>{{ dossier.caf.matricule }}</dd></div>
        <div><dt class="fr-text--sm fr-mb-1v">Code organisme</dt><dd>{{ dossier.caf.organisme }}</dd></div>
      </dl>

      <h3 class="fr-h6 fr-mb-2w">Situation foyer</h3>
      <dl class="alexi-grille">
        <div><dt class="fr-text--sm fr-mb-1v">Montant du dernier loyer connu</dt><dd>{{ nr(dossier.caf.loyer) }}</dd></div>
        <div>
          <dt class="fr-text--sm fr-mb-1v">Type d’aide au logement</dt>
          <dd>
            {{ nr(dossier.caf.typeAide) }}
            <span class="fr-text--sm alexi-bloc">Montant net de l’aide au logement : {{ nr(dossier.caf.montantAide) }}</span>
          </dd>
        </div>
        <div><dt class="fr-text--sm fr-mb-1v">Surface du logement</dt><dd>{{ nr(dossier.caf.surface) }}</dd></div>
        <div><dt class="fr-text--sm fr-mb-1v">Tiers payant</dt><dd>{{ ouiNon(dossier.caf.tiersPayant) }}</dd></div>
        <div><dt class="fr-text--sm fr-mb-1v">Revenu de solidarité active (RSA)</dt><dd>{{ ouiNon(dossier.caf.rsa) }}</dd></div>
      </dl>
      <DsfrAccordion class="fr-mt-3w" :title="`Autres indicateurs CAF (${dossier.caf.autres.length})`">
        <dl class="alexi-grille">
          <div v-for="ind in dossier.caf.autres" :key="ind.libelle">
            <dt class="fr-text--sm fr-mb-1v">{{ ind.libelle }}</dt>
            <dd>
              {{ nr(ind.valeur) }}
              <span v-for="pr in ind.precisions ?? []" :key="pr.libelle" class="fr-text--sm alexi-bloc">
                {{ pr.libelle }} : {{ nr(pr.valeur) }}
              </span>
            </dd>
          </div>
        </dl>
      </DsfrAccordion>
    </section>

    <!-- Dette locative : toutes les informations reçues ou saisies -->
    <section id="dette" class="fr-mb-8w" aria-labelledby="titre-dette-info">
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

    <!-- Locaux -->
    <section id="locaux" class="fr-mb-8w" aria-labelledby="titre-locaux">
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
    <section id="bailleur" class="fr-mb-8w" aria-labelledby="titre-bailleur">
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

      <h3 class="fr-h6 fr-mt-5w fr-mb-1w">Mandat de gestion</h3>
      <p>{{ b.gestionnaire ?? 'Aucun mandat de gestion n’a été signalé.' }}</p>
      <DsfrAccordion v-if="b.precedents.length" class="fr-mt-2w" :title="`Bailleurs précédents (${b.precedents.length})`">
        <ul class="fr-mb-0">
          <li v-for="p in b.precedents" :key="p.nom"><strong>{{ p.nom }}</strong> · {{ p.detail }} · {{ p.periode }}</li>
        </ul>
      </DsfrAccordion>
    </section>

    <!-- Acteurs et contacts -->
    <section id="acteurs" aria-labelledby="titre-acteurs-info">
      <h2 id="titre-acteurs-info" class="fr-h4">Acteurs et contacts</h2>
      <!-- Comme dans l'application : responsable à l'étude puis commissaire, sans action (données de l'étude) -->
      <h3 class="fr-h6 fr-mb-2w">Commissaire de justice</h3>
      <TableauDsfr v-if="dossier.cj" titre="Commissaire de justice" :entetes="['Rôle', 'Identité', 'Téléphone', 'Adresse électronique']">
        <tr v-for="r in rolesCj" :key="r.role">
          <td>{{ r.role }}</td>
          <td class="alexi-coupe">{{ r.personne.nom }}</td>
          <td>{{ r.personne.telephone ?? 'Non renseigné' }}</td>
          <td class="alexi-coupe">{{ r.personne.email ?? 'Non renseigné' }}</td>
        </tr>
      </TableauDsfr>
      <p v-else>Aucun commissaire de justice n’a été renseigné.</p>

      <h3 class="fr-h6 fr-mt-5w fr-mb-2w">Autres contacts</h3>
      <TableauDsfr
        v-if="dossier.contacts.length"
        titre="Autres contacts"
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
  </div>
</template>
