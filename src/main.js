import { createApp } from 'vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSnowman, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'font-awesome-animation/css/font-awesome-animation.min.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// import BootstrapVue from 'bootstrap-vue'

import BootstrapVue3 from 'bootstrap-vue-3'
import Toaster from '@meforma/vue-toaster';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.css'

import App from './App.vue'
import router from './router'
import http from './http'

library.add(faSnowman)
library.add(faWrench)

const app = createApp(App)
if(localStorage.getItem('token')) {
    app.config.globalProperties.$loggedIn = 'true';
} else {
    app.config.globalProperties.$loggedIn = 'false';
};
app.config.globalProperties.$http = http;
app.config.globalProperties.$up = (pro, value) => {
    app.config.globalProperties[pro] = value;
}
app.config.globalProperties.$logOut = () => {
    localStorage.removeItem("token")
    app.config.globalProperties.$up('$loggedIn', 'false')
    router.push('/login')
};
app.use(router)
app.use(VueSweetalert2)
app.use(BootstrapVue3)
app.use(Toaster, {
    position: 'top-right'
})
app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
