# Prototype : refonte de la page dossier d'Alexi

## Contexte

Alexi est une application de la DIHAL pour suivre les procédures d'expulsion locative.
Les gestionnaires des DDETS et des préfectures consultent un « dossier » par ménage.
On refait la page dossier. Ce dépôt est un **prototype autonome** qui sert de référence aux développeurs de l'équipe. Ce n'est pas le code de production.

Le fichier `reference/alexi-page-dossier-prototype.html` est une première version en HTML avec le DSFR.
**Lis-le en entier avant de commencer** : il contient les textes, les données fictives, les 4 états et les 3 profils.
Reprends son contenu mais applique les changements de la section « Ce qui change par rapport au HTML ».

## Stack

- Vite + Vue 3 + TypeScript + vue-router
- Vue DSFR (`@gouvminint/vue-dsfr`) et le DSFR (`@gouvfr/dsfr`)
- Pour le graphique : DSFR Chart (`@gouvfr/dsfr-chart`). S'il est trop compliqué à intégrer, fais un graphique en barres en SVG simple aux couleurs DSFR, accessible
- Pas d'autre bibliothèque d'interface. Pas de CSS maison sauf pour la mise en page quand le DSFR n'a rien

**Vérifie le nom et les props de chaque composant dans la documentation de Vue DSFR avant de t'en servir. Ne devine pas.**

## Routes

- `/` redirige vers `/dossiers/2026-034-1047676/synthese`
- `/dossiers/:num/synthese` (onglet par défaut)
- `/dossiers/:num/informations` avec des ancres de section (`#occupants`, `#locaux`, `#bailleur`…)
- `/dossiers/:num/procedure`

Les onglets utilisent le composant d'onglets DSFR **synchronisé avec le routeur** : changer d'onglet change l'URL et ouvrir une URL ouvre le bon onglet. Le bouton retour du navigateur doit marcher.
Ne remplace pas les onglets par des liens qui ressemblent à des onglets : pour un lecteur d'écran ce serait faux (RGAA).

## Barre du prototype

Tout en haut, en dehors de la maquette : deux listes déroulantes DSFR.
- **État du dossier** : complet · informations manquantes · procédure avancée et plusieurs procédures · ménage nombreux et noms longs
- **Profil** : gestionnaire DDETS · administrateur · lecture seule (partenaire)

Garde le choix dans l'URL (`?etat=…&profil=…`) pour pouvoir partager un lien vers un cas précis.
Les données viennent de fichiers de données fictives, un par état (reprends ceux du HTML).

## En-tête du dossier (sur les 3 onglets)

1. Fil d'Ariane : Accueil › Dossiers et procédures › Dossier n°
2. Titre : « Dossier 2026-034-1047676 »
3. Badges : motif de la procédure en cours (« Impayé de loyer ») · étape (« Étape : Signalement CAF ») · « Vulnérabilité » seulement si le dossier est vulnérable (le calcul existe déjà côté serveur)
4. Une ligne : occupant principal « et N autres occupants » · adresse du local principal · « + N local » s'il y en a d'autres
5. Bouton secondaire « Inscrire en commission » (absent en lecture seule)
6. **Une seule petite ligne** en dessous : organisation référente · agent référent · créé le · modifié le
   - Le profil administrateur voit un bouton « Modifier » à côté de l'organisation référente

## Onglet Synthèse : version allégée

Retour utilisateur sur le HTML : « c'est un peu chargé ». Objectif : moitié moins long et plus aéré.

1. **Trois cartes encadrées** côte à côte (empilées sur petit écran). Ce sont les seuls blocs avec une bordure.
   - **Procédure en cours** : indicateur d'étapes DSFR (DsfrStepper : étape, « Étape X sur 9 », étape suivante). Plus la prochaine date clé s'il y en a une (audience, expulsion prévue). Lien « Ouvrir la procédure ».
   - **Dette locative** : montant en grand · « soit X mois de loyer » · « impayée depuis X mois ».
   - **Ménage** : nombre d'occupants · nombre de mineurs avec leurs âges s'ils sont 3 ou moins · titulaire(s) du bail. Lien vers les occupants.
   - Le titre de chaque carte peut être le lien : un seul lien par carte au maximum.
2. **Dette et ressources** : une ligne de 4 chiffres (loyer · charges · aide au logement et tiers payant · reste à charge estimé).
   - **Graphique de l'évolution de la dette** en barres, une barre par étape (signalement, CDP, assignation…). **Affiché seulement à partir de 2 montants.**
   - Sous le graphique : bouton « Voir les données » qui affiche le tableau (alternative texte obligatoire RGAA).
3. **Une seule liste sans encadré**, sur deux colonnes (libellé · valeur), qui remplace les 4 anciens blocs :
   Logement · Locaux secondaires · Bailleur · Gestionnaire · Commission · Commissaire de justice · Autres contacts.
   **Une ligne vide n'est pas affichée** dans la Synthèse.
4. **Une seule mention des sources** en bas : « Sources : CAF, flux reçu le … ».
5. Grands espacements entre les sections (échelle d'espacement DSFR). Peu de texte gris.

## Onglet Informations

Sections avec un titre h2, **sans menu ni sommaire** :

1. **Occupants** : tableau complet. Actions par ligne : deux boutons icône tertiaires (crayon « Modifier », corbeille « Supprimer ») dont le libellé accessible contient le nom de la personne. En dessous : « Ajouter un occupant » et « Signaler une vulnérabilité ». Accordéon « Occupants ayant quitté le logement ».
2. **Situation du foyer (CAF)** : les champs utiles visibles, les autres indicateurs dans un accordéon. « - » s'affiche « Non renseigné ». Source et date du flux. S'il n'y a pas de données CAF : un encadré l'explique. Pas de bouton « Mettre à jour » (les données arrivent automatiquement).
3. **Locaux** : un bloc par local, badge « Local principal », icônes crayon et corbeille.
4. **Bailleur** : bailleur actuel avec deux actions distinctes « Corriger une information » et « Changer de bailleur ». Bailleurs précédents datés dans un accordéon.
5. **Acteurs et contacts** : commissaire de justice, responsable du dossier à l'étude, autres contacts.
6. **Commissions** : liste des passages, bouton « Inscrire en commission ».

Dans Informations, les champs vides restent affichés avec « Non renseigné » (contrairement à la Synthèse).

## Onglet Procédure

Le contenu réel ne fait pas partie du prototype : affiche un encadré « Contenu inchangé : étapes, documents et commentaires ».
Si le dossier a plusieurs procédures : liste déroulante « Procédure affichée » au-dessus.

## Profils

- **Lecture seule** : aucun bouton d'action. Les boutons sont **retirés, pas désactivés**.
- **Administrateur** : comme le gestionnaire, plus « Modifier » sur l'organisation référente.

## Contraintes

- Uniquement les composants, couleurs, typographie (Marianne) et espacements du DSFR.
- RGAA 4.1 : vrais boutons et liens, titres hiérarchisés sans saut, tableaux avec `th scope`, libellés accessibles sur les boutons icône, contrastes DSFR.
- Largeur de contenu d'environ 1 050 px.
- Utilisable à 400 % de zoom (équivalent à 320 px de large) : tout s'empile, rien ne déborde, les tableaux défilent dans leur cadre.
- Textes de l'interface en français.

## Hors sujet (ne pas faire)

Historique des modifications · carte ou lien Géoportail · bloc « Points d'attention » · sommaire ou menu de sections · modales d'édition (elles existent déjà dans l'application).

## Déroulé attendu

1. Crée le projet et installe les dépendances.
2. Construis l'en-tête et les 3 routes avec les onglets, puis la Synthèse, puis Informations.
3. Lance `npm run build` et corrige toutes les erreurs.
4. Vérifie chaque état et chaque profil dans le navigateur, et à 400 % de zoom.
5. Ajoute un `README.md` court : comment lancer le projet et liste des choix faits.
6. Optionnel si je le demande : un workflow GitHub Actions qui publie le prototype sur GitHub Pages (pense à la `base` de Vite).
