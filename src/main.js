import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/vuetify'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './registerServiceWorker'
import firebase from 'firebase'
import VueAlertify from 'vue-alertify'
import Vuelidate from 'vuelidate'
 
Vue.use(VueAlertify,{
  moveBounded: true, 
  notifier: {
  // auto-dismiss wait time (in seconds)
  delay: 5,
  // default position
  position: 'bottom-center',
  // adds a close button to notifier messages
  closeButton: false,
  }
});

Vue.use(Vuelidate)

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

firebase.initializeApp(config)

Vue.config.productionTip = false

var typeLineItems = []
firebase.firestore()
  .collection('typeLine')
  .onSnapshot(typeLines => {
    typeLineItems = []
    typeLines.forEach(typeLine => {
        typeLineItems.push(typeLine.data().name)
    })
    store.commit('setTypeLineItems', typeLineItems)
  })

var requestsItems = []
firebase.firestore()
  .collection('optionsRequests')
  .onSnapshot(optionsRequests => {
    optionsRequests.forEach(request => {
      requestsItems.push(request.data())
    })
    store.commit('setRequestsItems', requestsItems)
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')