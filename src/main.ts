import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { registerUiComponent } from './plugins/global/components'

const app = createApp(App)

app.use(registerUiComponent)

app.use(createPinia())
app.use(router)

app.mount('#app')
