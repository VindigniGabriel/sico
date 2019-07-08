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

    quote: null,
    dialogRequestQuote: false, //Editar requerimiento en cita
    dialogRequestQuoteData: {client: null},
    addRequest: false,
    listQuote: [],

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
    moment: null,
    setDark: true,
    technologies: '',
    requestsItems: '',
    date: null,
    dialogSettingsRequests: false,
    dialogSettingsRequestsEdit: '',
    dialogSettingsRequestsData: {
      id: null,
      name: null,
      phone: null,
      technologies: null,
      face: null,
      service: null
    },
    dialogSettingsServices: false,
    dialogSettingsServicesTechnologie: '',
    dialogSettingsServicesData: '',
    dialogSettingsServicesEdit: false,

    //Loading
    dialogLoading: false
   
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

    setAddRequest(state, payload){
      state.addRequest = payload
    },

    setQuote(state, payload){
      state.quote = payload
    },

    setDialogRequestQuote(state, payload){
      state.dialogRequestQuote = payload.status
      state.dialogRequestQuoteData = payload.data
    },

    setListQuote(state, payload){
      state.listQuote = []
      state.requestsItems.forEach(request => {
        let quotesConfirm = payload.filter(r => r.status === 'con Cita confirmada' && r.request === request.name)
        let quotesNoConfirm = payload.filter(r => r.status === 'con Cita por confirmar' && r.request === request.name)
        let quotesProcessed = payload.filter(r => r.status === 'Procesado' && r.request === request.name)
        let quotesNotProcessed = payload.filter(r => r.status === 'No procedente' && r.request === request.name)
        let quotesClose = payload.filter(r => r.status === 'Cerrado' && r.request === request.name)

        state.listQuote.push({
          request: request.name,
          wait: quotesNoConfirm.length,
          check: quotesConfirm.length,
          processed: quotesProcessed.length,
          notProcessed: quotesNotProcessed.length,
          close: quotesClose.length,
        })
      })
    },

    //New Request for Client
    setDialogNewRequest(state, payload){
      state.dialogNewRequest = payload
      if(payload) state.date = moment().format("YYYY-MM-DD HH:mm:ss")
    },

    //Settings
    setMoment: (state) => {
      state.date = moment().format("YYYY-MM-DD HH:mm:ss")
    },
    setSetDark(state, payload){
      state.setDark = payload
    },
    setTypeLineItems(state, payload){
      state.technologies = payload
    },
    setRequestsItems(state, payload){
      state.requestsItems = payload
    },

    setDialogSettingsRequests(state, payload){
      state.dialogSettingsRequests = payload.status,
      state.dialogSettingsRequestsEdit = payload.edit
      if(payload.edit){
        state.dialogSettingsRequestsData.id = payload.data.id
        state.dialogSettingsRequestsData.face = payload.data.face
        state.dialogSettingsRequestsData.name = payload.data.name
        state.dialogSettingsRequestsData.phone = payload.data.phone
        state.dialogSettingsRequestsData.service = payload.data.service
        state.dialogSettingsRequestsData.technologies = payload.data.technologies
      }else{
        state.dialogSettingsRequestsData.id = null
        state.dialogSettingsRequestsData.face = null
        state.dialogSettingsRequestsData.name = null
        state.dialogSettingsRequestsData.phone = null
        state.dialogSettingsRequestsData.service = null
        state.dialogSettingsRequestsData.technologies = null
      }
    },

    setDialogSettingsServices(state, payload){
      state.dialogSettingsServices = payload.status
      state.dialogSettingsServicesTechnologie = payload.technologie
      state.dialogSettingsServicesData = payload.data
      state.dialogSettingsServicesEdit = payload.edit
    },

    setDialogLoading(state, payload){
      state.dialogLoading = payload
    }

  },
  actions: {

  }
})
