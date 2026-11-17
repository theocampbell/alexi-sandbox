import type { Dossier } from '../types'
import { BASE_OCCUPANTS, CAF_COMPLET } from '../communs'

const dossier: Dossier = {
  ref: '2025-034-0983114',
  vulnerable: true,
  orgRef: 'DDETS de l’Hérault',
  agent: { nom: 'Sophie DURAND', email: 'sophie.durand@ddets.exemple.gouv.fr' },
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
      { etape: 'Signalement CAF', date: '3 déc. 2025', montant: 1200 },
      { etape: 'Commandement de payer', date: '6 févr. 2026', montant: 2000.45 },
      { etape: 'Assignation', date: '14 sept. 2026', montant: 4850 },
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
    { nom: 'Camille ROUX', role: 'Travailleuse sociale · CCAS de Béziers', contact: '04 67 22 33 44 · camille.roux@ccas.exemple.fr' },
    { nom: 'Karine BLANC', role: 'Conseillère en économie sociale et familiale · Habitat Sud Logement', contact: 'k.blanc@habitat-sud.exemple.fr' },
  ],
  commissions: [
    { date: '12 déc. 2026', instance: 'CCAPEX de l’Hérault', statut: 'Inscrit' },
    { date: '14 mars 2026', instance: 'CCAPEX de l’Hérault', statut: 'Examiné', avis: 'Saisir le FSL et mettre en place un plan d’apurement' },
  ],
  accompagnement: {
    dsf: { statut: 'Réalisé', date: '20 janv. 2026', par: 'Camille ROUX · CCAS de Béziers' },
    dispositifs: [
      { nom: 'Fonds de solidarité pour le logement (FSL) · maintien', statut: 'Accordé', date: '15 avr. 2026', detail: 'Aide de 1 200,00 €', porteur: 'Conseil départemental de l’Hérault' },
      { nom: 'Plan d’apurement', statut: 'En cours', date: '2 mai 2026', detail: '150,00 € par mois, 3 échéances impayées', porteur: 'Habitat Sud Logement' },
      { nom: 'Accompagnement social lié au logement (ASLL)', statut: 'Demandé', date: '2 oct. 2026', porteur: 'CCAS de Béziers' },
    ],
  },
}

export default dossier
