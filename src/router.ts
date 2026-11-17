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

// Mesuré avant la navigation : après, le contenu a changé de hauteur et la mesure ne veut plus rien dire
let ongletsHorsEcran = false

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
    if (savedPosition) return savedPosition
    if (to.params.num === from.params.num) {
      // Changer d'onglet ne fait pas remonter la page… sauf si les onglets sont sortis de l'écran
      // (lien en bas d'une carte de la Synthèse par exemple) : on remonte alors au début des onglets.
      return ongletsHorsEcran ? { el: '.fr-tabs', top: 16 } : false
    }
    return { top: 0 }
  },
})

router.beforeEach(() => {
  const onglets = document.querySelector('.fr-tabs')
  ongletsHorsEcran = !!onglets && onglets.getBoundingClientRect().top < 0
})

export default router
