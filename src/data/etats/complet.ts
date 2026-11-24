import type { Dossier } from '../types'
import { BAILLEUR_IMMOGEST, BASE_OCCUPANTS, CAF_COMPLET } from '../communs'

const dossier: Dossier = {
  ref: '2026-034-1047676',
  vulnerable: true,
  referents: [{ nom: 'Julie NAVARRO', email: 'julie.navarro@ddets.exemple.gouv.fr' }],
  cree: '28 oct. 2026',
  modifie: '16 nov. 2026',
  occupants: BASE_OCCUPANTS,
  occupantsPartis: [],
  locaux: [
    { principal: true, titre: '8 rue des Lilas', ligne2: '34500 Béziers', type: 'Habitation' },
    { principal: false, titre: 'Parking n°14', ligne2: '8 rue des Lilas 34500 Béziers', type: 'Stationnement' },
  ],
  caf: CAF_COMPLET,
  dette: {
    montant: 1000,
    anciennete: '2 mois',
    evolution: [{ origine: 'CAF', date: '1er sept. 2026', montant: 1000, loyer: 1000, charges: 0, fraisAnnexes: null, partSurDettes: null }],
  },
  procedures: [{ motif: 'Impayé de loyer', etape: 1, depuis: '28 oct. 2026', close: false, prochaine: null }],
  bailleur: BAILLEUR_IMMOGEST,
  cj: null,
  contacts: [],
  organismeAccompagnement: null,
  commissions: [],
}

export default dossier
