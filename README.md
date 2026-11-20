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

- `etat` : `complet` · `sansCaf` · `incomplet` · `avance` · `nombreux`
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
- **Onglet Accompagnement** (ajouté après le brief) : il regroupe ce qui concerne le suivi social, pour accueillir les futures fonctionnalités des travailleurs sociaux. Il contient, dans l'ordre : l'organisme d'accompagnement sociojuridique (on désigne la structure, pas une personne), puis les Commissions (déplacées depuis Informations : date, instance, statut). Informations garde « Acteurs et contacts » : commissaire de justice et autres contacts (avocat, curateur, proche…), avec « Ajouter un contact ».
- **État et profil dans l'URL** (`?etat=…&profil=…`). Changer d'état met aussi à jour le numéro de dossier dans le chemin. Sans `?etat`, l'état se déduit du numéro.
- **Lecture seule** : les boutons d'action sont retirés du DOM, pas désactivés.
- **Pas de graphique** : le graphique de l'évolution de la dette a été retiré (peu d'apport pour beaucoup de place). Le détail est dans le tableau de la dette, dans Informations.
- **Dette liée à la procédure** : la dette appartient à une procédure d'impayé. Dans Informations, la section « Dette locative » indique la procédure en cours à laquelle elle se rattache. Pour une procédure close, choisie dans « Procédure affichée » de l'onglet Procédure, son tableau de dette s'affiche dans cet onglet, en lecture seule (exemple : dossier « Procédure avancée », impayé de loyer clos en 2023).
- **Dette locative** : le tableau reprend les colonnes de l'application en production (origine, date de mise à jour, montant, dont loyer / charges / frais annexes, part sur l'ensemble des dettes). Il est toujours visible dans Informations (section « Dette locative »). La carte « Dette locative » de la Synthèse n'en reprend que « Dont loyer » (dernière ligne, même libellé), quelle que soit la source ; le reste du détail est dans Informations. Les ressources du foyer (loyer mensuel, aide au logement, tiers payant) sont des lignes de la liste « Logement, ressources et acteurs », seulement avec des données CAF, avec les libellés de « Situation du foyer ». Charges mensuelles et reste à charge estimé ont été retirés : ils n'existent pas dans l'application. « Ajouter une information sur la dette » est dans Informations uniquement.
- **Référents** : il n'y a pas d'organisation référente. Un dossier a 0, 1 ou plusieurs référents, qui sont des personnes (en-tête du dossier). Le gestionnaire et l'administrateur peuvent les modifier ; en lecture seule, le bouton est retiré. L'administrateur n'a pour l'instant aucun droit en plus.
- **Tableaux** : un petit composant `TableauDsfr` avec le balisage DSFR 1.14 (`fr-table__wrapper/container/content`), pour qu'ils défilent dans leur cadre à 400 % de zoom. Pourquoi pas les composants de Vue DSFR : `DsfrTable` produit l'ancien balisage, et `DsfrDataTable` rend chaque cellule focusable (une tabulation par cellule). Les noms (occupants, étapes) sont des en-têtes de ligne (`th scope="row"`).
- **Boutons icône** (crayon, corbeille) : `DsfrButton` avec `icon-only`. Leur nom accessible contient celui de la personne ou du local (« Modifier Mme Sonia RAMIREZ-LEROUX »).
- **Données CAF seulement avec un signalement CAF** : la section « Données CAF » (Informations) et la ligne « Données CAF » (Synthèse) n'apparaissent que si le dossier vient d'un signalement CAF. Libellés, groupes (« Données spécifiques CAF », « Situation foyer ») et ordre repris de l'application ; « - » s'affiche « Non renseigné ». Comparer les états « Dossier complet (signalement CAF) » et « Dossier complet sans signalement CAF ».
- **Libellés de l'application** : « Pas de référent », « Aucun mandat de gestion n'a été signalé. », « Aucun commissaire de justice n'a été renseigné. », « Aucun contact n'a été renseigné. ».
- **Tableaux dans Informations** : occupants, dette, locaux, bailleur et autres contacts sont des tableaux, comme dans l'application, avec les mêmes boutons icône (crayon, corbeille) sur chaque ligne. Colonnes des locaux et du bailleur reprises de l'application. Le local principal ne se supprime pas.
- **Synthèse en lecture seule** : aucune action d'édition dans l'onglet Synthèse. Les actions vivent dans Informations et Accompagnement ; dans la Synthèse, les seuls liens sont ceux des trois cartes (un par carte), aucun en dessous.
- **Synthèse** : les 3 cartes sont les seuls blocs encadrés, avec au plus un lien chacune. La liste « Logement et acteurs » masque les lignes vides. Les sources sont mentionnées une seule fois, en bas de l'onglet, une ligne par donnée (ressources du foyer : CAF ; dette : la source de la dernière information, qui peut être la CAF, le commissaire de justice ou une saisie manuelle).
- **Informations** : les champs vides restent affichés avec « Non renseigné ».
- **Titre de page** unique par onglet (« Synthèse · Dossier … – Alexi »).
- **Stepper à 9 étapes** : le stepper DSFR s'arrête à 8 étapes, alors que la procédure en compte 9. `mise-en-page.css` ajoute les deux variables manquantes (`--steps: 9`, `--current-step: 9`), sur le modèle des règles DSFR. Écart à signaler à l'équipe DSFR.
- **Largeur** : le conteneur DSFR par défaut, soit 1 200 px de contenu, comme dans l'application actuelle.
- **CSS** : uniquement la mise en page (grilles, encadrés), avec les variables de couleur DSFR. Imports DSFR en versions `*.main.min.css`, car les fichiers legacy sont rejetés par Vite 8.

## Vérifications faites

- `npm run build` sans erreur.
- Les 5 états × 4 onglets, plus les profils administrateur et lecture seule : axe-core (WCAG 2.1 AA + bonnes pratiques) ne trouve aucune violation, il n'y a aucune erreur de console et les titres sont dans l'ordre.
- À 320 px de large (équivalent à un zoom de 400 %) : pas de défilement horizontal de la page.
- Navigation : clic et flèches sur les onglets, bouton retour, listes déroulantes du prototype, liens des cartes de la Synthèse.

## Écarts voulus avec l'application actuelle (refonte)

Ces différences avec l'application actuelle sont des choix de la refonte, pas des erreurs :

- **Commissaire de justice** : dans « Acteurs et contacts », et non plus sous « Bailleur » à côté du mandat de gestion.
- **En-tête du dossier** : titre « Dossier … », badges, ligne d'occupants et d'adresse, puis une seule ligne référents · dates, au lieu des dates et du référent en haut à droite.
- **Données CAF** : pas de bouton « Mettre à jour les données de la CAF » (les données arrivent automatiquement), indicateurs secondaires dans un accordéon, « Non renseigné » à la place de « - ».

## Principe : seulement les informations qui existent

Le prototype réorganise **uniquement les informations qui existent déjà dans l'application**, pour pouvoir être remis tel quel aux développeurs. Les idées de nouvelles fonctionnalités ne sont pas dans les pages : elles sont listées ci-dessous.

## Fonctionnalités à venir (retirées du prototype pour l'instant)

- **Diagnostic social et financier** dans l'onglet Accompagnement : statut (demandé, réalisé), date et organisme qui l'a réalisé.
- **Dispositifs mobilisés** dans l'onglet Accompagnement : FSL, plan d'apurement, ASLL…, avec statut (demandé, accordé, en cours, refusé, terminé), date, précisions et porteur, et un bouton « Ajouter un dispositif ».
- **Avis de la commission** : une colonne dans le tableau des passages en commission.

## Hors sujet

Historique des modifications, carte Géoportail, bloc « Points d'attention », sommaire, modales d'édition.
