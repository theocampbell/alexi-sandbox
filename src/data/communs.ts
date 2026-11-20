import type { Bailleur, Caf, Occupant } from './types'

/** Données partagées entre plusieurs états (comme dans le prototype HTML) */

export const BASE_OCCUPANTS: Occupant[] = [
  { nom: 'Mme Sonia RAMIREZ-LEROUX', naissance: '1er oct. 1978', age: 48, role: 'Titulaire du bail', titulaire: true, detail: 'Allocataire CAF n° 731205', coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Lucas RAMIREZ', naissance: '20 févr. 2002', age: 24, role: 'Occupant', titulaire: false, coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Théo VASSEUR', naissance: '20 févr. 2007', age: 19, role: 'Occupant', titulaire: false, coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Léna VASSEUR', naissance: '10 févr. 2012', age: 14, role: 'Occupante', titulaire: false, coord: null, activite: 'Scolarisée' },
  { nom: 'Inès VASSEUR', naissance: '17 sept. 2014', age: 12, role: 'Occupante', titulaire: false, coord: null, activite: 'Scolarisée' },
]

export const CAF_COMPLET: Caf = {
  miseAJour: '13 novembre 2026 à 17h04 (Paris)',
  matricule: '731205',
  organisme: '146',
  loyer: '561,39 €',
  typeAide: 'Allocation de logement familiale',
  montantAide: '527,00 €',
  surface: '66 m²',
  tiersPayant: true,
  rsa: true,
  autres: [
    { libelle: 'Fin de l’occupation', valeur: 'Non' },
    { libelle: 'Surendettement', valeur: 'Non' },
    {
      libelle: 'Mesure de protection (suspension de la capacité administrative)',
      valeur: 'Non',
      precisions: [
        { libelle: 'Raison sociale du tuteur', valeur: null },
        { libelle: 'Identité du tuteur', valeur: null },
      ],
    },
    { libelle: 'Insalubrité', valeur: 'Non' },
    { libelle: 'Péril', valeur: 'Non' },
    { libelle: 'Surpeuplement', valeur: 'Non' },
    { libelle: 'Non décence', valeur: 'Non' },
    { libelle: 'Colocation', valeur: 'Non' },
    {
      libelle: 'Grossesse d’une des personnes occupant le logement',
      valeur: null,
      precisions: [{ libelle: 'Date de début de grossesse', valeur: null }],
    },
    { libelle: 'Allocation aux adultes handicapés (AAH)', valeur: null },
    { libelle: 'Allocation d’éducation de l’enfant handicapé (AEEH)', valeur: null },
    { libelle: 'Allocation journalière de présence parentale (AJPP)', valeur: null },
    { libelle: 'Allocation journalière du proche aidant (AJPA)', valeur: null },
  ],
}

/** Variante de CAF_COMPLET pour un autre ménage */
export const cafPour = (diff: Partial<Caf>): Caf => ({ ...CAF_COMPLET, ...diff })

export const BAILLEUR_IMMOGEST: Bailleur = {
  nom: 'IMMOGEST SUD',
  type: 'Bailleur privé',
  nature: 'Personne morale',
  siret: '834 512 907 00018',
  adresse: ['45 avenue Camille Saint-Saëns', '34500 Béziers'],
  contact: null,
  depuis: '15 janv. 2024',
  gestionnaire: null,
  precedents: [{ nom: 'M. Paul GARNIER', detail: 'Bailleur privé · personne physique', periode: 'du 3 mars 2019 au 14 janv. 2024' }],
}
