import type { Dossier } from '../types'
import { BAILLEUR_IMMOGEST, BASE_OCCUPANTS, CAF_COMPLET } from '../communs'

const dossier: Dossier = {
  ref: '2026-034-1047676',
  vulnerable: true,
  orgRef: 'DDETS de l’Hérault',
  agent: null,
  cree: '28 oct. 2026',
  modifie: '16 nov. 2026',
  occupants: BASE_OCCUPANTS,
  occupantsPartis: [],
  locaux: [
    { principal: true, titre: '8 rue des Lilas', ligne2: '34500 Béziers', type: 'Habitation', surface: '66 m²' },
    { principal: false, titre: 'Parking n°14', ligne2: '8 rue des Lilas 34500 Béziers', type: 'Stationnement' },
  ],
  caf: CAF_COMPLET,
  dette: {
    montant: 1000,
    mois: '1,8',
    anciennete: '2 mois',
    date: '1er sept. 2026',
    loyer: '561,39 €',
    charges: '0,00 €',
    aide: '527,00 €',
    tiersPayant: true,
    reste: '34,39 €',
    evolution: [{ etape: 'Signalement CAF', date: '1er sept. 2026', montant: 1000 }],
  },
  procedures: [{ motif: 'Impayé de loyer', etape: 1, depuis: '28 oct. 2026', close: false, prochaine: null }],
  bailleur: BAILLEUR_IMMOGEST,
  cj: null,
  contacts: [],
  organismeAccompagnement: null,
  commissions: [],
  accompagnement: { dsf: null, dispositifs: [] },
}

export default dossier
