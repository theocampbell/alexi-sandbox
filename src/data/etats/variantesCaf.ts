import type { Dossier } from '../types'
import { AUTRES_NON, CAF_COMPLET, prestations } from '../communs'
import complet from './complet'

/**
 * Variantes du dossier complet pour tester l'affichage conditionnel des données CAF.
 * Seules les données CAF changent.
 */
const variante = (caf: Partial<NonNullable<Dossier['caf']>>): Dossier => ({ ...complet, caf: { ...CAF_COMPLET, ...caf } })

/** Situation foyer seule : ni autres indicateurs ni prestations dans le flux */
export const cafFoyer = variante({ autres: [], prestations: [] })

/** Situation foyer + autres indicateurs, tous à « Non » */
export const cafIndicateurs = variante({ autres: AUTRES_NON, prestations: [] })

/** Situation foyer + indicateurs + prestations */
export const cafPrestations = variante({ autres: AUTRES_NON, prestations: prestations({ rsa: 'Oui', ajpp: 'Non' }) })

/** Indicateurs signalés : surendettement, mesure de protection (avec tuteur) et grossesse à « Oui » */
export const cafSignalements = variante({
  autres: [
    ...AUTRES_NON.map((i) => {
      if (i.libelle === 'Surendettement') return { ...i, valeur: 'Oui' }
      if (i.libelle.startsWith('Mesure de protection'))
        return {
          ...i,
          valeur: 'Oui',
          precisions: [
            { libelle: 'Raison sociale du tuteur', valeur: 'UDAF de l’Hérault' },
            { libelle: 'Identité du tuteur', valeur: null },
          ],
        }
      return i
    }),
    {
      libelle: 'Grossesse d’une des personnes occupant le logement',
      valeur: 'Oui',
      precisions: [{ libelle: 'Date de début de grossesse', valeur: '3 septembre 2026' }],
    },
  ],
  prestations: prestations({ rsa: 'Oui', aah: 'Oui', aeeh: 'Non' }),
})
