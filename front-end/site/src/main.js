import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import Loading from 'vue-loading-overlay';
import ModalErro from '../src/components/ModalErro.vue'
import ModalAlert from '../src/components/ModalAlert.vue'
import NavBar from './components/NavBar.vue'

import App from './App.vue'
import router from './router/index'

createApp(App).use(router)
.component("loading", Loading)
.component("modal-erro", ModalErro)
.component("modal-alert", ModalAlert)
.component("NavBar", NavBar)
.mount('#app')
