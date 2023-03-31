import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import 'uno.css'
import App from './App.vue'
import './samples/node-api'

const pinia = createPinia()
const app = createApp(App)

app
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
