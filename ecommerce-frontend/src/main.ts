import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// mdi-font
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(ElementPlus)

app.mount('#app')
