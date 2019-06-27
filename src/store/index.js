import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    // Data User Sing or Logout
    idOffice: null,
    statusSesion: false,
    userEmail: null,
    userName: null,

    // Data Client
    clientExists: false,
  
    clientData: {
      name: null,
      clientId: '',
      identify: 'V',
      contact1: '',
      contact2: ''
    },

    clientRequests: [],

    //New Requests Client
    dialogNewRequest: false,

    //Options for Cleave
    optionsCleaveIdentify: {
      numeral: true,
      numeralDecimalMark: ',',
      delimiter: '.',
      prefix: 'V'
    },

    optionsCleaveService: {
      uppercase: true,
      delimiter: '-'
    },

    //Settings
    technologies: '',
    requestsItems: '',
    date: null,
    dialogSettingsRequests: false,
    dialogSettingsServices: false,
    dialogSettingsServicesTechnologie: '',
    dialogSettingsServicesData: '',
    dialogSettingsServicesEdit: false
   
  },
  mutations: {

    //Updated for Data User Sing or Logout
    setIdOffice(state, payload){
      state.idOffice = payload
    },
    setStatusSesion(state, payload){
      state.statusSesion = payload
    },
    setUserEmail(state, payload){
      state.userEmail = payload
    },
    setUserName(state, payload){
      state.userName = payload
    },

    //Updated for Data Client
    setClientExists(state, payload){
      state.clientExists = payload
    },

    setClientRequests(state, payload){
      if(payload === undefined){
        state.clientRequests = []
      }else{
        state.clientRequests.push(payload)
      }
    },

    setClientData(state, payload){
      state.clientData.clientId = payload.clientId
      state.clientData.contact1 = payload.contact1
      state.clientData.contact2 = payload.contact2
      state.clientData.name = payload.name
    },

    setClientDataFirestore(state, payload){
      state.clientData.clientId = payload.clientId
      state.clientData.contact1 = payload.contact1
      state.clientData.contact2 = payload.contact2
      state.clientData.name = payload.name
      state.clientData.identify = payload.identify
    },

    //New Request for Client
    setDialogNewRequest(state, payload){
      state.dialogNewRequest = payload
      if(payload) state.date = moment().format("YYYY-MM-DD HH:mm:ss")
    },

    //Settings
    setTypeLineItems(state, payload){
      state.technologies = payload
    },
    setRequestsItems(state, payload){
      state.requestsItems = payload
    },

    setDialogSettingsRequests(state, payload){
      state.dialogSettingsRequests = payload
    },

    setDialogSettingsServices(state, payload){
      state.dialogSettingsServices = payload.status
      state.dialogSettingsServicesTechnologie = payload.technologie
      state.dialogSettingsServicesData = payload.data
      state.dialogSettingsServicesEdit = payload.edit
    }

  },
  actions: {

  }
})
