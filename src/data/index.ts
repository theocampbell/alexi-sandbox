import type { Dossier, EtatId, ProfilId } from './types'
import complet from './etats/complet'
import incomplet from './etats/incomplet'
import sansCaf from './etats/sansCaf'
import avance from './etats/avance'
import nombreux from './etats/nombreux'

export * from './types'

export const ETATS: Record<EtatId, Dossier> = { complet, sansCaf, incomplet, avance, nombreux }

export const OPTIONS_ETAT: { value: EtatId; text: string }[] = [
  { value: 'complet', text: 'Dossier complet (signalement CAF)' },
  { value: 'sansCaf', text: 'Dossier complet sans signalement CAF' },
  { value: 'incomplet', text: 'Informations manquantes' },
  { value: 'avance', text: 'Procédure avancée et plusieurs procédures' },
  { value: 'nombreux', text: 'Ménage nombreux et noms longs' },
]

export const OPTIONS_PROFIL: { value: ProfilId; text: string }[] = [
  { value: 'gestionnaire', text: 'Gestionnaire DDETS' },
  { value: 'admin', text: 'Administrateur' },
  { value: 'lecture', text: 'Lecture seule (partenaire)' },
]

export const DOSSIER_PAR_DEFAUT = complet.ref

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
export const formatEuros = (n: number) => euros.format(n)

/** « 3 occupants », « 1 mineur »… */
export const pluriel = (n: number, singulier: string, plurielForme = `${singulier}s`) =>
  `${n} ${n > 1 ? plurielForme : singulier}`
