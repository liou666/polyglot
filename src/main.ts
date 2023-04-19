import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import 'uno.css'
import App from './App.vue'
import './samples/node-api'
import router from './router'
import { db } from './db'

const pinia = createPinia()
const app = createApp(App)

pinia.use((context) => {
  const { store } = context

  // 在store数据变化时，将数据存储到IndexedDB中
  store.$subscribe((mutation, state) => {
    db.pinaStore.put({
      key: mutation.key,
      value: JSON.stringify(state),
    })
  })
})

app
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
