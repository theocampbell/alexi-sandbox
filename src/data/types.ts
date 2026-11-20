export const ETAPES = [
  'Prévention',
  'Signalement CAF',
  'Commandement de payer',
  'Assignation',
  'Décision judiciaire',
  'Commandement de quitter les lieux',
  'Réquisition de la force publique',
  'Décision sur la force publique',
  'Exécution',
] as const

export type EtatId = 'complet' | 'sansCaf' | 'incomplet' | 'avance' | 'nombreux'
export type ProfilId = 'gestionnaire' | 'admin' | 'lecture'

export interface Occupant {
  nom: string
  naissance: string | null
  age: number | null
  role: string
  /** Précision sous le rôle (ex. numéro d'allocataire) */
  detail?: string
  coord: string | null
  activite: string | null
  titulaire: boolean
}

export interface Local {
  principal: boolean
  titre: string
  ligne2: string
  type: string
}

/** Indicateur CAF, éventuellement précisé (ex. mesure de protection → tuteur) ; null = « - » */
export interface IndicateurCaf {
  libelle: string
  valeur: string | null
  precisions?: { libelle: string; valeur: string | null }[]
}

/** Données CAF : présentes seulement si le dossier vient d'un signalement CAF. Libellés de l'application. */
export interface Caf {
  /** « 13 novembre 2026 à 17h04 (Paris) » */
  miseAJour: string
  /** Données spécifiques CAF */
  matricule: string
  organisme: string
  /** Situation foyer : champs principaux */
  loyer: string | null
  typeAide: string | null
  montantAide: string | null
  surface: string | null
  tiersPayant: boolean | null
  rsa: boolean | null
  /** Situation foyer : autres indicateurs, dans l'ordre de l'application */
  autres: IndicateurCaf[]
}

/** Une ligne du tableau de la dette (mêmes colonnes que l'application en production) */
export interface PointDette {
  /** Origine de l'information : CAF, commissaire de justice, bailleur, saisie manuelle… */
  origine: string
  /** Date de mise à jour */
  date: string
  /** Montants en euros (montant = loyer + charges + frais annexes) */
  montant: number
  loyer: number | null
  charges: number | null
  fraisAnnexes: number | null
  /** Part de la dette locative sur l'ensemble des dettes, en % */
  partSurDettes: number | null
}

/**
 * Le montant de la dette est toujours connu. Le détail (dont loyer, charges…) est dans
 * le tableau `evolution`, la dernière ligne étant l'information la plus récente.
 * Les ressources du foyer (loyer, aide au logement) viennent de la CAF : voir `Caf`.
 */
export interface Dette {
  montant: number
  mois: string | null
  anciennete: string | null
  evolution: PointDette[]
}

export interface Procedure {
  motif: string
  /** Index dans ETAPES, null pour une procédure close sans étape */
  etape: number | null
  depuis: string
  close: boolean
  fin?: string
  /** Prochaine date clé (audience, expulsion prévue…) */
  prochaine?: string | null
  /**
   * Dette d'une procédure close (impayé de loyer). La dette de la procédure en cours,
   * elle, est dans Dossier.dette (onglet Informations).
   */
  dette?: PointDette[]
}

export interface Bailleur {
  nom: string
  type: string
  nature: string
  siret: string | null
  adresse: string[] | null
  contact: string | null
  depuis: string | null
  gestionnaire: string | null
  precedents: { nom: string; detail: string; periode: string }[]
}

export interface Dossier {
  ref: string
  vulnerable: boolean
  /** Référents du dossier : 0, 1 ou plusieurs personnes (pas d'organisation référente) */
  referents: { nom: string; email: string }[]
  cree: string
  modifie: string
  occupants: Occupant[]
  occupantsPartis: Occupant[]
  locaux: Local[]
  caf: Caf | null
  dette: Dette
  procedures: Procedure[]
  bailleur: Bailleur
  cj: { nom: string; contact: string; responsable: string | null } | null
  /** Autres contacts : avocat, curateur, proche… (onglet Informations) */
  contacts: Contact[]
  /** Organisme d'accompagnement sociojuridique : on désigne la structure, pas une personne */
  organismeAccompagnement: OrganismeAccompagnement | null
  commissions: Commission[]
}

export interface Contact {
  nom: string
  role: string
  contact: string
}

export interface OrganismeAccompagnement {
  nom: string
  /** Type de structure (CCAS, association…) */
  type: string
  contact: string
  depuis: string
}

/** Passage du dossier en réunion de commission (mêmes informations que l'application) */
export interface Commission {
  /** Date de la réunion, en toutes lettres : « 18 novembre 2026 » */
  date: string
  /** Heure de la réunion : « 05h00 (Paris) » */
  heure: string
  /** Commission : « CCAPEX Centrale - Hérault » */
  instance: string
  statut: 'À venir' | 'Passée'
}


