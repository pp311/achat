import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { VueSignalR } from '@dreamonkey/vue-signalr';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(vue3GoogleLogin, {
  clientId: '291666639911-cbb2rv1djk8j0jdb73iafombum6n7tf3.apps.googleusercontent.com'
})
const connection = new HubConnectionBuilder()
  .withUrl('http://localhost:8080/signalr')
  .build();

app.use(VueSignalR, { connection } as any)

app.use(Vue3Toasity, {
    autoClose: 5000,
  } as ToastContainerOptions)

app.use(createPinia())
app.use(router)

app.mount('#app')
