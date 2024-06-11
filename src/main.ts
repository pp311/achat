import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'
import { HttpTransportType, HubConnectionBuilder, type IHttpConnectionOptions } from '@microsoft/signalr'
import { VueSignalR, type VueSignalRConfig } from '@dreamonkey/vue-signalr';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const app = createApp(App)

app.use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,

})
const connection = new HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_API_BASE_URL + '/signalr', {
        accessTokenFactory: async () => localStorage.getItem('token') || sessionStorage.getItem('token'),
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
    } as IHttpConnectionOptions)
    .withAutomaticReconnect()
    .build();

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    if (token || to.name === 'login' || to.name === 'register') {
        next()
    } else {
        next({ name: 'login' })
    }
})

app.use(VueSignalR, { connection } as VueSignalRConfig)

app.component('QuillEditor', QuillEditor)

app.use(Vue3Toasity, {
    autoClose: 5000,
} as ToastContainerOptions)

app.use(createPinia())
app.use(router)

app.mount('#app')
