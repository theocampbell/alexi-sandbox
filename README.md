# Alexi · prototype de la page dossier

Prototype autonome de la refonte de la page dossier d'Alexi (DIHAL). Il sert de référence de conception, ce n'est pas le code de production. Toutes les données sont fictives.
Le cahier des charges est dans `BRIEF.md` ; la première version HTML est dans `reference/`.

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification des types + build dans dist/
npm run preview    # sert le build
```

Pour ouvrir un cas précis : `/dossiers/2026-034-1047676/synthese?etat=avance&profil=lecture`.

- `etat` : `complet` · `incomplet` · `avance` · `nombreux`
- `profil` : `gestionnaire` · `admin` · `lecture`

## Publication

Le workflow `.github/workflows/pages.yml` publie le prototype sur GitHub Pages à chaque push sur `main`. Il construit avec `BASE_URL=/<nom-du-dépôt>/` (la `base` de Vite) et copie `index.html` en `404.html` pour que les liens profonds fonctionnent.
Une seule fois dans GitHub : Settings › Pages › Source : **GitHub Actions**.

## Structure

```
src/
  data/            un fichier de données fictives par état (etats/*.ts) + types
  composables/     usePrototype : état, profil et dossier lus depuis l'URL
  components/      barre du prototype, en-tête du dossier, tableaux
  pages/           DossierPage (onglets) + un composant par onglet
  router.ts        routes /dossiers/:num/{synthese,informations,accompagnement,procedure}
  styles/          mise en page uniquement (variables DSFR pour les couleurs)
```

## Choix faits

- **Onglets synchronisés avec le routeur.** `DsfrTabs` reste le vrai composant d'onglets (`role="tab"`, flèches du clavier). L'index de l'onglet se calcule à partir de la route, et changer d'onglet pousse la route : l'URL, l'ouverture directe d'une URL et le bouton retour fonctionnent. Seul l'onglet actif rend son contenu (`RouterView`), pour éviter les identifiants en double.
- **Pas de liens vers une section** : un lien ouvre un onglet, pas un endroit précis de l'onglet. Les ancres se battaient avec l'animation de glissement des onglets DSFR. Si les onglets sont sortis de l'écran (lien en bas de la Synthèse), la page remonte au début des onglets.
- **Onglet Accompagnement** (ajouté après le brief) : il regroupe ce qui concerne le suivi social, pour accueillir les futures fonctionnalités des travailleurs sociaux. Il contient, dans l'ordre : l'organisme d'accompagnement sociojuridique (on désigne la structure, pas une personne), les Commissions (déplacées depuis Informations, avec statut et avis), puis le diagnostic social et financier et les dispositifs mobilisés (FSL, plan d'apurement, ASLL). Informations garde « Acteurs et contacts » : commissaire de justice et autres contacts (avocat, curateur, proche…), avec « Ajouter un contact ». Les données de diagnostic et de dispositifs sont des propositions fictives.
- **État et profil dans l'URL** (`?etat=…&profil=…`). Changer d'état met aussi à jour le numéro de dossier dans le chemin. Sans `?etat`, l'état se déduit du numéro.
- **Lecture seule** : les boutons d'action sont retirés du DOM, pas désactivés.
- **Pas de graphique** : le graphique de l'évolution de la dette a été retiré (peu d'apport pour beaucoup de place). Le détail est dans le tableau de la dette, dans Informations.
- **Dette locative** : le tableau reprend les colonnes de l'application en production (origine, date de mise à jour, montant, dont loyer / charges / frais annexes, part sur l'ensemble des dettes). Il est toujours visible dans Informations (section « Dette locative »). La Synthèse n'en garde que le montant (carte « Dette locative », toujours connu) et les chiffres connus parmi loyer, charges, aide et reste à charge. « Ajouter une information sur la dette » est dans Informations uniquement.
- **Référents** : il n'y a pas d'organisation référente. Un dossier a 0, 1 ou plusieurs référents, qui sont des personnes (en-tête du dossier). Le gestionnaire et l'administrateur peuvent les modifier ; en lecture seule, le bouton est retiré. L'administrateur n'a pour l'instant aucun droit en plus.
- **Tableaux** : un petit composant `TableauDsfr` avec le balisage DSFR 1.14 (`fr-table__wrapper/container/content`), pour qu'ils défilent dans leur cadre à 400 % de zoom. Pourquoi pas les composants de Vue DSFR : `DsfrTable` produit l'ancien balisage, et `DsfrDataTable` rend chaque cellule focusable (une tabulation par cellule). Les noms (occupants, étapes) sont des en-têtes de ligne (`th scope="row"`).
- **Boutons icône** (crayon, corbeille) : `DsfrButton` avec `icon-only`. Leur nom accessible contient celui de la personne ou du local (« Modifier Mme Sonia RAMIREZ-LEROUX »).
- **Synthèse en lecture seule** : aucune action d'édition dans l'onglet Synthèse. Les actions vivent dans Informations et Accompagnement ; dans la Synthèse, les seuls liens sont ceux des trois cartes (un par carte), aucun en dessous.
- **Synthèse** : les 3 cartes sont les seuls blocs encadrés, avec au plus un lien chacune. La liste « Logement et acteurs » masque les lignes vides. Les sources sont mentionnées une seule fois, en bas de l'onglet, une ligne par donnée (ressources du foyer : CAF ; dette : la source de la dernière information, qui peut être la CAF, le commissaire de justice ou une saisie manuelle). La carte « Dette locative » rappelle aussi la source de son montant.
- **Informations** : les champs vides restent affichés avec « Non renseigné ».
- **Titre de page** unique par onglet (« Synthèse · Dossier … – Alexi »).
- **Stepper à 9 étapes** : le stepper DSFR s'arrête à 8 étapes, alors que la procédure en compte 9. `mise-en-page.css` ajoute les deux variables manquantes (`--steps: 9`, `--current-step: 9`), sur le modèle des règles DSFR. Écart à signaler à l'équipe DSFR.
- **Largeur** : le conteneur DSFR par défaut, soit 1 200 px de contenu, comme dans l'application actuelle.
- **CSS** : uniquement la mise en page (grilles, encadrés), avec les variables de couleur DSFR. Imports DSFR en versions `*.main.min.css`, car les fichiers legacy sont rejetés par Vite 8.

## Vérifications faites

- `npm run build` sans erreur.
- Les 4 états × 4 onglets, plus les profils administrateur et lecture seule : axe-core (WCAG 2.1 AA + bonnes pratiques) ne trouve aucune violation, il n'y a aucune erreur de console et les titres sont dans l'ordre.
- À 320 px de large (équivalent à un zoom de 400 %) : pas de défilement horizontal de la page.
- Navigation : clic et flèches sur les onglets, bouton retour, listes déroulantes du prototype, liens des cartes de la Synthèse.

## Hors sujet

Historique des modifications, carte Géoportail, bloc « Points d'attention », sommaire, modales d'édition.
