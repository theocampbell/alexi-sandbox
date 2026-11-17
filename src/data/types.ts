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

export type EtatId = 'complet' | 'incomplet' | 'avance' | 'nombreux'
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
  surface?: string | null
}

export interface Caf {
  date: string
  matricule: string
  organisme: string
  surface: string
  loyer: string
  aide: string
  tiersPayant: boolean
  rsa: boolean
  /** Autres indicateurs : [libellé, valeur ou null si « - »] */
  autres: [string, string | null][]
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

/** Le montant de la dette est toujours connu ; le reste peut manquer */
export interface Dette {
  montant: number
  mois: string | null
  anciennete: string | null
  date: string
  loyer: string | null
  charges: string | null
  aide: string | null
  tiersPayant: boolean | null
  reste: string | null
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
  accompagnement: Accompagnement
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

export interface Commission {
  date: string
  instance: string
  statut: 'Inscrit' | 'Examiné' | 'Ajourné'
  /** Décision ou recommandation de la commission */
  avis?: string
}

export interface Dispositif {
  nom: string
  statut: 'Demandé' | 'Accordé' | 'En cours' | 'Refusé' | 'Terminé'
  date: string
  detail?: string
  porteur: string
}

export interface Accompagnement {
  dispositifs: Dispositif[]
}
