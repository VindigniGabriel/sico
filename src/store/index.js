import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import firebase from 'firebase'

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
    quotes: [], //Atención diaria
    quotesFilter: [], //Atención diaria con filtro por aplicaciones disponibles

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
    customerSupport: true,
    moment: null,
    setDark: true,
    technologies: '',
    requestsItems: '',
    aplications: [], //por defecto todas las aplicaciones estarán en estatus disponible
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

    setQuotes(state, payload){
      state.quotes = payload
    },

    setQuotesFilter(state, payload){
      state.quotesFilter = payload
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
          customerSupport: [
            quotesConfirm.length,
            quotesProcessed.length + quotesNotProcessed.length + quotesClose.length
          ]
        })
      })
    },
    //Mostrar tipo de atención del día
    setCustomerSupport(state, payload){
      state.customerSupport = payload
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
    setAplications(state, payload){
      state.aplications = payload
    },
    setAplicationsStatus(state){
      state.quotesFilter = []
      let enabledAplications = state.aplications.filter(a => a.status === true).map(r => r.name)
      state.requestsItems.filter(r => r.face === true).forEach(rq => {

        rq.technologies.forEach(technologie => {
            let sizeI = technologie.aplications.filter(value => enabledAplications.includes(value))
            if(sizeI.length === technologie.aplications.length){
              let quotes = state.quotes.filter(r => r.request === rq.name && r.technologie === technologie.name)
              if(quotes.length > 0) {
                quotes.forEach(quote => {
                  state.quotesFilter.push(quote)
                })
              }
            }

        })
        
      })
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
    //citas del día
    setQuotes(context){
      firebase.firestore()
        .collection('clientsRequests')
        .where('idOffice', '==', context.state.idOffice)
        .where('quote', '==',  moment().format('DD/MM/YYYY'))
        .onSnapshot(s => {
          let requests = []
          context.commit('setDialogLoading', true)
          let quotes = []
          context.commit('setQuotes', quotes)
          if(s.empty) context.commit('setDialogLoading', false)
          requests = []
          let client = null
          context.state.quotes = []
          s.forEach(request => {
            firebase.firestore()
              .collection('clientsRegisters')
              .doc(request.data().clientId)
              .get()
              .then(c => {
                if(c.empty) context.commit('setDialogLoading', false)
                firebase.firestore()
                  .collection('officeCommercial')
                  .doc(context.state.idOffice)
                  .get()
                  .then(office => {
                    let ocm = office.data().name
                    client = c.data()
                    quotes.push({
                      id: request.id,
                      created: request.data().created,
                      author: request.data().author,
                      office: ocm,
                      request: request.data().request,
                      phone: request.data().phone,
                      technologie: request.data().technologie,
                      observations: request.data().observations,
                      quote: request.data().quote,
                      close: request.data().close,
                      status: request.data().status,
                      subOption: request.data().subOption,
                      update: request.data().update,
                      client
                    })
                    context.commit('setDialogLoading', false)
                    context.commit('setQuotes', quotes.filter(q => q.status != 'con Cita por confirmar'))
                    context.commit('setQuotesFilter', quotes.filter(q => q.status != 'con Cita por confirmar'))
                  })
                })
            requests.push(request.data())
          })
          context.commit('setListQuote', requests)
        })
    }, 
  }
})
