import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css'

/* Fetch sample data */
store.dispatch('fetch', 'clients')
store.dispatch('fetch', 'history')

/* Dark mode */
// store.dispatch('darkMode')

/* Default title tag */
const defaultDocumentTitle = 'Admin One Vue 3 Tailwind'

router.afterEach(to => {
  /* Set document title from route meta */

  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Collapse mobile aside menu on route change */

  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)

  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

createApp(App).use(store).use(router).mount('#app')
