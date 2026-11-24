import type { Dossier } from '../types'

const dossier: Dossier = {
  ref: '2026-034-1051203',
  vulnerable: false,
  referents: [],
  cree: '12 nov. 2026',
  modifie: '12 nov. 2026',
  occupants: [{ nom: 'M. Olivier BRUNET', naissance: null, age: null, role: 'Titulaire du bail', titulaire: true, coord: null, activite: null }],
  occupantsPartis: [],
  locaux: [{ principal: true, titre: '3 impasse des Oliviers', ligne2: '34500 Béziers', type: 'Habitation' }],
  caf: null,
  // Montant saisi à la création du dossier ; le détail n'est pas encore connu
  dette: {
    montant: 1450,
    anciennete: null,
    evolution: [
      { origine: 'Saisie manuelle (DDETS de l’Hérault)', date: '12 nov. 2026', montant: 1450, loyer: null, charges: null, fraisAnnexes: null, partSurDettes: null },
    ],
  },
  procedures: [{ motif: 'Impayé de loyer', etape: 0, depuis: '12 nov. 2026', close: false, prochaine: null }],
  bailleur: {
    nom: 'Mme Catherine LAMBERT',
    type: 'Bailleur privé',
    nature: 'Personne physique',
    siret: null,
    adresse: null,
    contact: null,
    depuis: null,
    mandat: null,
    precedents: [],
  },
  cj: null,
  contacts: [],
  organismeAccompagnement: null,
  commissions: [],
}

export default dossier
