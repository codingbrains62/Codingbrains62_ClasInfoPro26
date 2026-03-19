import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import Card from 'primevue/card'
import Divider from 'primevue/divider'


import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/css/style.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component('Card', Card);
app.component('Divider', Divider);
app.component('Toast', Toast);
app.mount('#app')
