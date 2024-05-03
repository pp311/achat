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

const app = createApp(App)

app.use(vue3GoogleLogin, {
    clientId: '291666639911-cbb2rv1djk8j0jdb73iafombum6n7tf3.apps.googleusercontent.com'
})
const connection = new HubConnectionBuilder()
    .withUrl('http://localhost:8080/signalr', {
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

app.use(Vue3Toasity, {
    autoClose: 5000,
} as ToastContainerOptions)

app.use(createPinia())
app.use(router)

app.mount('#app')
