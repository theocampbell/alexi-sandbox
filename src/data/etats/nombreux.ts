import type { Dossier, Occupant } from '../types'
import { BAILLEUR_IMMOGEST, CAF_COMPLET } from '../communs'

const NOM = 'DE MONTCLAR-BEAUREGARD-LEFEBVRE'
const prenoms = ['Louise', 'Gabriel', 'Chloé', 'Hugo', 'Manon', 'Arthur', 'Zoé', 'Jules', 'Alice', 'Noah']
const ages = [22, 19, 17, 15, 13, 11, 9, 7, 4, 1]

const enfants: Occupant[] = prenoms.map((p, i) => {
  const age = ages[i]
  return {
    nom: `${p} ${NOM}`,
    naissance: null,
    age,
    role: age < 18 ? 'Occupant · mineur' : 'Occupant',
    titulaire: false,
    coord: null,
    activite: age < 18 ? (age < 3 ? null : 'Scolarisé') : 'Étudiant',
  }
})

const dossier: Dossier = {
  ref: '2026-034-1049980',
  vulnerable: true,
  referents: [
    { nom: 'Marc-Antoine DU PLESSIS-VERNEUIL', email: 'marc-antoine.duplessis-verneuil@ddets.exemple.gouv.fr' },
    { nom: 'Anne-Sophie DE VILLENEUVE-SAINT-GEORGES', email: 'anne-sophie.devilleneuve-saint-georges@ddets.exemple.gouv.fr' },
  ],
  cree: '2 nov. 2026',
  modifie: '15 nov. 2026',
  occupants: [
    { nom: `Mme Anne-Charlotte ${NOM}`, naissance: '4 mai 1975', age: 51, role: 'Titulaire du bail', titulaire: true, detail: 'Allocataire CAF n° 602417', coord: '06 12 34 56 78', activite: 'Salariée' },
    { nom: `M. Pierre-Emmanuel ${NOM}`, naissance: '9 août 1973', age: 53, role: 'Titulaire du bail', titulaire: true, coord: null, activite: 'Retraité' },
    ...enfants,
  ],
  occupantsPartis: [],
  locaux: [
    {
      principal: true,
      titre: 'Résidence Les Hauts de Montmorency · bâtiment C · escalier 4 · appartement 1203',
      ligne2: '1287 boulevard du Maréchal Jean-Marie-Gabriel de Lattre de Tassigny 34500 Béziers',
      type: 'Habitation',
      surface: '92 m²',
    },
  ],
  caf: CAF_COMPLET,
  dette: {
    montant: 2310,
    mois: '2,6',
    anciennete: '3 mois',
    date: '1er nov. 2026',
    loyer: '890,00 €',
    charges: '60,00 €',
    aide: '612,00 €',
    tiersPayant: true,
    reste: '338,00 €',
    evolution: [{ origine: 'CAF', date: '1er nov. 2026', montant: 2310, loyer: 2130, charges: 180, fraisAnnexes: null, partSurDettes: null }],
  },
  procedures: [{ motif: 'Impayé de loyer', etape: 1, depuis: '2 nov. 2026', close: false, prochaine: null }],
  bailleur: BAILLEUR_IMMOGEST,
  cj: null,
  contacts: [
    { nom: 'Bernard MOREL', role: `Curateur de M. Pierre-Emmanuel ${NOM}`, contact: 'UDAF de l’Hérault · b.morel@udaf.exemple.fr' },
    { nom: 'Claire FONTAINE', role: 'Sœur de la titulaire du bail', contact: '06 98 76 54 32' },
  ],
  organismeAccompagnement: {
    nom: 'Association Logement Solidaire 34',
    type: 'Association agréée',
    contact: '04 67 88 99 00 · contact@logement-solidaire.exemple.org',
    depuis: '5 nov. 2026',
  },
  commissions: [],
}

export default dossier
