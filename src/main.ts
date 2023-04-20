import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import 'uno.css'
import App from './App.vue'
import './samples/node-api'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
