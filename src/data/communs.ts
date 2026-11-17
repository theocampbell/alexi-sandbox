import type { Bailleur, Caf, Occupant } from './types'

/** Données partagées entre plusieurs états (comme dans le prototype HTML) */

export const BASE_OCCUPANTS: Occupant[] = [
  { nom: 'Mme Hayat BEN-IHIA', naissance: '1er oct. 1978', age: 48, role: 'Titulaire du bail', titulaire: true, detail: 'Allocataire CAF n° 544893', coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Soufyane BENIHIA', naissance: '20 févr. 2002', age: 24, role: 'Occupant', titulaire: false, coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Monssef EL BACHIRI', naissance: '20 févr. 2007', age: 19, role: 'Occupant', titulaire: false, coord: null, activite: 'Chômage non indemnisé' },
  { nom: 'Nesrine BOURAJJOU', naissance: '10 févr. 2012', age: 14, role: 'Occupante', titulaire: false, coord: null, activite: 'Scolarisée' },
  { nom: 'Camelia BOURAJJOU', naissance: '17 sept. 2014', age: 12, role: 'Occupante', titulaire: false, coord: null, activite: 'Scolarisée' },
]

export const CAF_COMPLET: Caf = {
  date: '13 nov. 2026 à 17h04',
  matricule: '544893',
  organisme: '146',
  surface: '66 m²',
  loyer: '561,39 €',
  aide: 'Allocation de logement familiale · 527,00 €',
  tiersPayant: true,
  rsa: true,
  autres: [
    ['Fin de l’occupation', 'Non'],
    ['Surendettement', 'Non'],
    ['Mesure de protection', 'Non'],
    ['Insalubrité', 'Non'],
    ['Péril', 'Non'],
    ['Non-décence', 'Non'],
    ['Surpeuplement', 'Non'],
    ['Colocation', 'Non'],
    ['Grossesse', null],
    ['AAH', null],
    ['AEEH', null],
    ['AJPP', null],
    ['AJPA', null],
  ],
}

export const BAILLEUR_CAPIGI: Bailleur = {
  nom: 'CAPIGI',
  type: 'Bailleur privé',
  nature: 'Personne morale',
  siret: '125 761 798 44513',
  adresse: ['45 avenue Camille Saint-Saëns', '34500 Béziers'],
  contact: null,
  depuis: '15 janv. 2024',
  gestionnaire: null,
  precedents: [{ nom: 'M. Jean DUPONT', detail: 'Bailleur privé · personne physique', periode: 'du 3 mars 2019 au 14 janv. 2024' }],
}
