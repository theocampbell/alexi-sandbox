import type { Dossier } from '../types'
import { BASE_OCCUPANTS, CAF_COMPLET } from '../communs'

const dossier: Dossier = {
  ref: '2025-034-0983114',
  vulnerable: true,
  referents: [
    { nom: 'Sophie DURAND', email: 'sophie.durand@ddets.exemple.gouv.fr' },
    { nom: 'Thomas GIRAUD', email: 'thomas.giraud@ddets.exemple.gouv.fr' },
  ],
  cree: '4 févr. 2025',
  modifie: '10 nov. 2026',
  occupants: BASE_OCCUPANTS.slice(0, 3),
  occupantsPartis: BASE_OCCUPANTS.slice(3, 4).map((o) => ({ ...o })),
  locaux: [{ principal: true, titre: '21 avenue Jean Jaurès', ligne2: '34500 Béziers', type: 'Habitation', surface: '48 m²' }],
  caf: CAF_COMPLET,
  dette: {
    montant: 4850,
    mois: '8,6',
    anciennete: '11 mois',
    date: '2 oct. 2026',
    loyer: '561,39 €',
    charges: '45,00 €',
    aide: 'Suspendue',
    tiersPayant: false,
    reste: '606,39 €',
    evolution: [
      { origine: 'CAF', date: '3 déc. 2025', montant: 1200, loyer: 1110, charges: 90, fraisAnnexes: null, partSurDettes: null },
      { origine: 'Commissaire de justice', date: '6 févr. 2026', montant: 2000.45, loyer: 1665, charges: 135, fraisAnnexes: 200.45, partSurDettes: null },
      { origine: 'Commissaire de justice', date: '14 sept. 2026', montant: 4850, loyer: 4150, charges: 405, fraisAnnexes: 295, partSurDettes: null },
      { origine: 'Saisie manuelle (CCAS de Béziers)', date: '2 oct. 2026', montant: 4850, loyer: 4150, charges: 405, fraisAnnexes: 295, partSurDettes: 72 },
    ],
  },
  procedures: [
    { motif: 'Impayé de loyer', etape: 3, depuis: '14 sept. 2026', close: false, prochaine: 'Audience le 8 déc. 2026 à 10h45 · Tribunal judiciaire de Béziers' },
    { motif: 'Congé pour vendre', etape: null, depuis: '2 mars 2024', close: true, fin: '2 mars 2025' },
  ],
  bailleur: {
    nom: 'Habitat Sud Logement',
    type: 'Bailleur social',
    nature: 'Personne morale',
    siret: '412 345 678 00021',
    adresse: ['100 rue des Platanes', '34000 Montpellier'],
    contact: '04 67 00 00 00 · contact@habitat-sud.exemple.fr',
    depuis: '1er janv. 2018',
    gestionnaire: null,
    precedents: [],
  },
  cj: { nom: 'Me Julien MERCIER', contact: '04 67 11 22 33 · etude@mercier-cj.exemple.fr', responsable: 'M. Antoine FAURE · 04 05 06 07 08' },
  contacts: [
    { nom: 'Me Hélène PICARD', role: 'Avocate de la locataire', contact: '04 67 55 66 77 · h.picard@avocats.exemple.fr' },
  ],
  organismeAccompagnement: {
    nom: 'CCAS de Béziers',
    type: 'Centre communal d’action sociale',
    contact: '04 67 22 33 44 · accompagnement@ccas.exemple.fr',
    depuis: '20 janv. 2026',
  },
  commissions: [
    { date: '12 déc. 2026', instance: 'CCAPEX de l’Hérault', statut: 'Inscrit' },
    { date: '14 mars 2026', instance: 'CCAPEX de l’Hérault', statut: 'Examiné' },
  ],
}

export default dossier
