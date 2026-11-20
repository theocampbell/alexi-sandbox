import type { Dossier } from '../types'

/**
 * Dossier complet mais sans signalement CAF : la procédure a été ouverte par le commissaire de justice.
 * Pas de données CAF, la dette vient du commissaire de justice.
 */
const dossier: Dossier = {
  ref: '2026-034-1052410',
  vulnerable: false,
  referents: [{ nom: 'Julie NAVARRO', email: 'julie.navarro@ddets.exemple.gouv.fr' }],
  cree: '4 nov. 2026',
  modifie: '14 nov. 2026',
  occupants: [
    { nom: 'M. Antoine LEMAIRE', naissance: '12 juin 1986', age: 40, role: 'Titulaire du bail', titulaire: true, coord: '06 45 12 78 90', activite: 'Salarié' },
    { nom: 'Mme Clara LEMAIRE', naissance: '3 avr. 1988', age: 38, role: 'Titulaire du bail', titulaire: true, coord: null, activite: 'Salariée' },
    { nom: 'Hugo LEMAIRE', naissance: '21 janv. 2020', age: 6, role: 'Occupant', titulaire: false, coord: null, activite: 'Scolarisé' },
  ],
  occupantsPartis: [],
  locaux: [{ principal: true, titre: '14 rue Paul Riquet', ligne2: '34500 Béziers', type: 'Habitation' }],
  caf: null,
  dette: {
    montant: 3120,
    mois: '4,8',
    anciennete: '5 mois',
    evolution: [
      { origine: 'Commissaire de justice', date: '3 nov. 2026', montant: 3120, loyer: 2700, charges: 270, fraisAnnexes: 150, partSurDettes: null },
    ],
  },
  procedures: [{ motif: 'Impayé de loyer', etape: 2, depuis: '3 nov. 2026', close: false, prochaine: null }],
  bailleur: {
    nom: 'M. Henri BOUCHER',
    type: 'Bailleur privé',
    nature: 'Personne physique',
    siret: null,
    adresse: ['7 place de la Madeleine', '34500 Béziers'],
    contact: '06 71 22 33 44',
    depuis: '1er sept. 2019',
    gestionnaire: 'Agence immobilière du Biterrois, mandat de gestion depuis le 1er sept. 2019',
    precedents: [],
  },
  cj: {
    commissaire: { nom: 'Me Julien MERCIER', telephone: '04 67 11 22 33', email: 'etude@mercier-cj.exemple.fr' },
    responsable: null,
  },
  contacts: [],
  organismeAccompagnement: null,
  commissions: [],
}

export default dossier
