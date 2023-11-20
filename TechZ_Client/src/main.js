import { createApp } from 'vue'
import VueCookies from 'vue-cookies'
import router from './router'
import store from './store'
import App from './App.vue'

createApp(App).use(router).use(store).use(VueCookies).mount('#app')