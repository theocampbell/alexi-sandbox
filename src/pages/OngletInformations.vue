<script setup lang="ts">
import { computed } from 'vue'
import { pluriel } from '../data'
import { usePrototype } from '../composables/usePrototype'
import TableauDsfr from '../components/TableauDsfr.vue'
import DetteTableau from '../components/DetteTableau.vue'

const { dossier, peutModifier } = usePrototype()

const mineurs = computed(() => dossier.value.occupants.filter((o) => o.age !== null && o.age < 18))
const entetesOccupants = computed(() =>
  ['Identité', 'Naissance', 'Rôle', 'Coordonnées', 'Activité'].concat(peutModifier.value ? ['Actions'] : []),
)
const b = computed(() => dossier.value.bailleur)
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
          <th scope="row" class="alexi-coupe">
            <strong v-if="o.titulaire">{{ o.nom }}</strong>
            <template v-else>{{ o.nom }}</template>
          </th>
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

    <!-- Situation du foyer (CAF) -->
    <section id="caf" class="fr-mb-8w" aria-labelledby="titre-caf">
      <h2 id="titre-caf" class="fr-h4 fr-mb-1w">Situation du foyer</h2>
      <template v-if="dossier.caf">
        <p class="fr-text--sm fr-mb-3w">Source : CAF · flux reçu le {{ dossier.caf.date }}</p>
        <dl class="alexi-grille">
          <div>
            <dt class="fr-text--sm fr-mb-1v">Matricule allocataire · code organisme</dt>
            <dd>{{ dossier.caf.matricule }} · {{ dossier.caf.organisme }}</dd>
          </div>
          <div><dt class="fr-text--sm fr-mb-1v">Surface du logement</dt><dd>{{ dossier.caf.surface }}</dd></div>
          <div><dt class="fr-text--sm fr-mb-1v">Loyer mensuel</dt><dd>{{ dossier.caf.loyer }}</dd></div>
          <div><dt class="fr-text--sm fr-mb-1v">Aide au logement</dt><dd>{{ dossier.caf.aide }}</dd></div>
          <div><dt class="fr-text--sm fr-mb-1v">Tiers payant</dt><dd>{{ dossier.caf.tiersPayant ? 'Oui' : 'Non' }}</dd></div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">Revenu de solidarité active (RSA)</dt>
            <dd>{{ dossier.caf.rsa ? 'Oui' : 'Non' }}</dd>
          </div>
        </dl>
        <DsfrAccordion class="fr-mt-3w" :title="`Autres indicateurs CAF (${dossier.caf.autres.length})`">
          <dl class="alexi-grille">
            <div v-for="[libelle, valeur] in dossier.caf.autres" :key="libelle">
              <dt class="fr-text--sm fr-mb-1v">{{ libelle }}</dt>
              <dd>{{ valeur ?? 'Non renseigné' }}</dd>
            </div>
          </dl>
        </DsfrAccordion>
      </template>
      <DsfrCallout
        v-else
        class="fr-mt-2w"
        content="Aucune donnée reçue de la CAF pour ce foyer. Elles s’afficheront ici automatiquement dès réception du flux."
      />
    </section>

    <!-- Dette locative : toutes les informations reçues ou saisies -->
    <section id="dette" class="fr-mb-8w" aria-labelledby="titre-dette-info">
      <h2 id="titre-dette-info" class="fr-h4">Dette locative</h2>
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
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-for="l in dossier.locaux" :key="l.titre" class="fr-col-12 fr-col-md-6">
          <div class="alexi-carte">
            <p>
              <DsfrBadge
                small
                no-icon
                :type="l.principal ? 'info' : undefined"
                :label="l.principal ? 'Local principal' : 'Local secondaire'"
              />
            </p>
            <p class="alexi-coupe"><strong>{{ l.titre }}</strong><br />{{ l.ligne2 }}</p>
            <p class="fr-text--sm">{{ l.type }} · surface : {{ l.surface ?? 'non renseignée' }}</p>
            <div v-if="peutModifier" class="alexi-actions alexi-bas">
              <DsfrButton
                tertiary
                size="sm"
                icon="fr-icon-edit-line"
                icon-only
                :label="l.principal ? 'Modifier le local principal' : `Modifier ${l.titre}`"
              />
              <DsfrButton
                tertiary
                size="sm"
                icon="fr-icon-delete-line"
                icon-only
                :label="l.principal ? 'Supprimer le local principal' : `Supprimer ${l.titre}`"
              />
            </div>
          </div>
        </div>
      </div>
      <DsfrButton v-if="peutModifier" class="fr-mt-2w" secondary icon="fr-icon-add-line" label="Ajouter un local" />
    </section>

    <!-- Bailleur -->
    <section id="bailleur" class="fr-mb-8w" aria-labelledby="titre-bailleur">
      <h2 id="titre-bailleur" class="fr-h4">Bailleur</h2>
      <div class="alexi-carte">
        <div class="alexi-ligne-titre">
          <div>
            <h3 class="fr-h5 fr-mb-0 alexi-coupe">{{ b.nom }}</h3>
            <p class="fr-text--sm fr-mb-0">Bailleur actuel<template v-if="b.depuis"> · depuis le {{ b.depuis }}</template></p>
          </div>
          <DsfrButtonGroup
            v-if="peutModifier"
            size="sm"
            inline-layout-when="always"
            :buttons="[
              { label: 'Corriger une information', tertiary: true, icon: 'fr-icon-edit-line' },
              { label: 'Changer de bailleur', tertiary: true, icon: 'fr-icon-refresh-line' },
            ]"
          />
        </div>
        <dl class="alexi-grille fr-mt-2w">
          <div><dt class="fr-text--sm fr-mb-1v">Type · nature</dt><dd>{{ b.type }} · {{ b.nature.toLowerCase() }}</dd></div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">SIRET</dt>
            <dd>
              <a
                v-if="b.siret"
                :href="lienSiret(b.siret)"
                target="_blank"
                rel="noopener"
                :title="`${b.siret} sur l’annuaire des entreprises - nouvelle fenêtre`"
              >{{ b.siret }}</a>
              <template v-else>Non renseigné</template>
            </dd>
          </div>
          <div>
            <dt class="fr-text--sm fr-mb-1v">Adresse</dt>
            <dd>
              <template v-if="b.adresse">{{ b.adresse[0] }}<br />{{ b.adresse[1] }}</template>
              <template v-else>Non renseigné</template>
            </dd>
          </div>
          <div><dt class="fr-text--sm fr-mb-1v">Téléphone · courriel</dt><dd class="alexi-coupe">{{ b.contact ?? 'Non renseigné' }}</dd></div>
          <div><dt class="fr-text--sm fr-mb-1v">Mandat de gestion</dt><dd>{{ b.gestionnaire ?? 'Aucun mandat signalé' }}</dd></div>
        </dl>
      </div>
      <DsfrAccordion v-if="b.precedents.length" class="fr-mt-2w" :title="`Bailleurs précédents (${b.precedents.length})`">
        <ul class="fr-mb-0">
          <li v-for="p in b.precedents" :key="p.nom"><strong>{{ p.nom }}</strong> · {{ p.detail }} · {{ p.periode }}</li>
        </ul>
      </DsfrAccordion>
    </section>

    <!-- Acteurs et contacts -->
    <section id="acteurs" aria-labelledby="titre-acteurs-info">
      <h2 id="titre-acteurs-info" class="fr-h4">Acteurs et contacts</h2>
      <dl class="alexi-grille">
        <div>
          <dt class="fr-text--sm fr-mb-1v">Commissaire de justice</dt>
          <dd class="alexi-coupe">
            <template v-if="dossier.cj">{{ dossier.cj.nom }}<br /><span class="fr-text--sm">{{ dossier.cj.contact }}</span></template>
            <template v-else>Non renseigné</template>
          </dd>
        </div>
        <div>
          <dt class="fr-text--sm fr-mb-1v">Responsable du dossier à l’étude</dt>
          <dd>{{ dossier.cj?.responsable ?? 'Non renseigné' }}</dd>
        </div>
      </dl>

      <h3 class="fr-h6 fr-mt-5w fr-mb-2w">Autres contacts</h3>
      <dl v-if="dossier.contacts.length" class="alexi-grille">
        <div v-for="c in dossier.contacts" :key="c.nom" class="alexi-coupe">
          <dt><strong>{{ c.nom }}</strong></dt>
          <dd class="fr-text--sm fr-mb-0">{{ c.role }}<br />{{ c.contact }}</dd>
        </div>
      </dl>
      <p v-else>Aucun autre contact.</p>
      <p class="fr-text--sm fr-mt-3w fr-mb-0">L’organisme d’accompagnement sociojuridique est indiqué dans l’onglet Accompagnement.</p>
      <DsfrButton v-if="peutModifier" class="fr-mt-3w" secondary icon="fr-icon-add-line" label="Ajouter un contact" />
    </section>
  </div>
</template>
