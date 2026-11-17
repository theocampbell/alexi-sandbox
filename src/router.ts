import { createRouter, createWebHistory } from 'vue-router'
import { DOSSIER_PAR_DEFAUT } from './data'
import DossierPage from './pages/DossierPage.vue'
import OngletSynthese from './pages/OngletSynthese.vue'
import OngletInformations from './pages/OngletInformations.vue'
import OngletAccompagnement from './pages/OngletAccompagnement.vue'
import OngletProcedure from './pages/OngletProcedure.vue'

export const ONGLETS = [
  { name: 'synthese', titre: 'Synthèse' },
  { name: 'informations', titre: 'Informations' },
  { name: 'accompagnement', titre: 'Accompagnement' },
  { name: 'procedure', titre: 'Procédure' },
] as const

export type OngletName = (typeof ONGLETS)[number]['name']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: (to) => ({ path: `/dossiers/${DOSSIER_PAR_DEFAUT}/synthese`, query: to.query }) },
    {
      path: '/dossiers/:num',
      component: DossierPage,
      children: [
        { path: '', redirect: (to) => ({ name: 'synthese', params: to.params, query: to.query }) },
        { path: 'synthese', name: 'synthese', component: OngletSynthese },
        { path: 'informations', name: 'informations', component: OngletInformations },
        { path: 'accompagnement', name: 'accompagnement', component: OngletAccompagnement },
        { path: 'procedure', name: 'procedure', component: OngletProcedure },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Les ancres (#occupants, #commissions…) sont gérées par les onglets, qui y déplacent aussi le focus.
    if (to.hash) return false
    if (savedPosition) return savedPosition
    // Changer d'onglet ne fait pas remonter la page
    if (to.params.num === from.params.num) return false
    return { top: 0 }
  },
})

export default router
