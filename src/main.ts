import { createApp } from 'vue'
import VueDsfr from '@gouvminint/vue-dsfr'

// DSFR : on importe les versions « main » (les fichiers legacy sont rejetés par Vite 8)
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvminint/vue-dsfr/styles'

// DSFR Chart : seul le web component <bar-chart> est chargé
import '@gouvfr/dsfr-chart/BarChart'
import '@gouvfr/dsfr-chart/BarChart/css'

import './styles/mise-en-page.css'

import App from './App.vue'
import router from './router'

createApp(App).use(router).use(VueDsfr).mount('#app')
