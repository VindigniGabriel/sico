<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogRequestQuote" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Gestión del requerimiento</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click="save">Guardar</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-container grid-list-lg>
                <v-layout wrap>
                    <v-flex xs12 sm6>
                        <v-card class="mb-3">
                            <v-card-text>
                                <v-list two-line subheader>
                                    <v-subheader>Datos del usuario</v-subheader>
                                    <v-list-tile avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Nombre: {{dialogRequestQuoteData.client.name}}</v-list-tile-title>
                                            <v-list-tile-sub-title>Cédula: {{dialogRequestQuoteData.client.identify}}</v-list-tile-sub-title>
                                            <v-list-tile-sub-title>Tél contacto 1: {{dialogRequestQuoteData.client.contact1}}</v-list-tile-sub-title>
                                            <v-list-tile-sub-title v-show="dialogRequestQuoteData.client.contact2 != ''">Tél contacto 2: {{dialogRequestQuoteData.client.contact2}}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-card class="mb-3">
                            <v-card-text>
                                <v-list two-line subheader>
                                    <v-subheader>Detalle del requerimiento</v-subheader>
                                    <v-list-tile avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Requerimiento: {{dialogRequestQuoteData.request}}</v-list-tile-title>
                                            <v-list-tile-sub-title v-show="dialogRequestQuoteData.phone != ''">Línea: {{dialogRequestQuoteData.phone}}</v-list-tile-sub-title>
                                            <v-list-tile-sub-title>Técnologia: {{dialogRequestQuoteData.technologie}}</v-list-tile-sub-title>
                                            <v-list-tile-sub-title>Creado: {{dialogRequestQuoteData.created}}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-card
                            class="mb-3"
                        >
                            <v-card-title class="title font-weight-regular justify-space-between">
                            <v-subheader>Observaciones</v-subheader>
                            <v-avatar
                                color="teal lighten-3"
                                class="subheading white--text"
                                size="24"
                                v-text="step"
                            ></v-avatar>
                            </v-card-title>
                            <v-card-text>
                            <v-window v-model="step">
                                <v-window-item :value="index + 1" v-for="(observation, index) in dialogRequestQuoteData.observations" :key="index">
                                    <v-card>
                                        <v-list>
                                            <v-list-tile avatar>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Creado el: {{observation.date}}
                                                    </v-list-tile-title>
                                                    <v-list-tile-sub-title>
                                                        Autor: {{observation.author}}
                                                    </v-list-tile-sub-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>
                                        <v-container>
                                            <span>{{observation.content}}</span>
                                        </v-container>
                                    </v-card>
                                </v-window-item>
                            </v-window>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                            <v-btn
                                :disabled="step === 1"
                                flat
                                @click="step--"
                                small
                            >
                                Anterior
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                :disabled="step === dialogRequestQuoteData.observations.length"
                                color="teal lighten-3"
                                depressed
                                @click="step++"
                                small
                                outline
                            >
                                Siguiente
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-card class="mb-3">
                            <v-card-title>
                                <v-subheader>Estatus</v-subheader>
                            </v-card-title>
                            <v-card-text>
                                <v-select
                                    small
                                    color="teal lighten-3"
                                    :items="optionsStatus"
                                    label="Actualizar estatus a:"
                                    outline
                                    item-text="name"
                                    v-model="dialogRequestQuoteData.status"
                                    @change="changeStatus"
                                ></v-select>
                                <v-list>
                                    <v-list-tile class="green--text">
                                        Detalle: {{concept}}
                                    </v-list-tile>
                                    <v-list-tile class="cyan--text" v-show="calendar === 'true'">
                                        Fecha de la cita: {{dateFormat}}
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12>
                        <v-card class="mb-3" v-show="calendar === 'true'">
                            <v-card-title>
                                <v-subheader class="warning--text">Reasignar cita para {{dateFormat}}</v-subheader>
                            </v-card-title>
                            <v-card-text>
                                <v-container fluid>
                                    <v-layout wrap>
                                        <v-flex xs12 md6>
                                            <v-flex xs12 class="text-center">
                                                <v-date-picker 
                                                :min="min"
                                                v-model="date" 
                                                :reactive="true"
                                                locale="es"
                                                color="teal lighten-3"
                                                @input="fetchRequests"
                                                ></v-date-picker>
                                            </v-flex>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <Day/>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from "moment";
import firebase from 'firebase'
import { mapState, mapMutations } from 'vuex'
import Day from "./Day";
export default {
    components: {
        Day
    },
    data () {
        return {
            min: null,
            date: null,
            step: 1,
            optionsStatus: [],
            newStatus: null,
            requests: []
        }
    },
    watch: {
        calendar(val){
            this.date = this.dialogRequestQuoteData.quote.split("/").reverse().join("-")
            this.fetchRequests()
        }
    },
    computed: {
        ...mapState(['dialogRequestQuote', 'dialogRequestQuoteData', 'idOffice', 'requestsItems']),
        concept: state => state.optionsStatus.filter(o => o.name === state.dialogRequestQuoteData.status).map(s => s.concept).toString(),
        calendar: state => state.optionsStatus.filter(o => o.name === state.dialogRequestQuoteData.status).map(s => s.calendar).toString(),
        quote: state => state.optionsStatus.filter(o => o.name === state.dialogRequestQuoteData.status).map(s => s.quote).toString(),
        dateFormat: state => moment(state.date).format('DD/MM/YYYY')
    },
    methods: {
        ...mapMutations(['setDialogRequestQuote', 'setListQuote', 'setDialogLoading']),
        changeStatus(){
            
        },
        close(){
            this.setDialogRequestQuote({status: false, data: null})
        },
        fetchOptionStatus(){
            firebase.firestore()
                .collection('optionsStatus')
                .get()
                .then(s => {
                    this.optionsStatus = []
                    s.forEach(state => {
                        this.optionsStatus.push(state.data())
                    });
                })
        },
        fetchRequests(){
            let date = moment(this.date).format('DD/MM/YYYY')
            firebase.firestore()
                .collection('clientsRequests')
                .where('idOffice', '==', this.idOffice)
                .where('quote', '==', date)
                .onSnapshot(s => {
                    this.requests = []
                    s.forEach(request => {
                        this.requests.push(request.data())
                    })
                    this.setListQuote(this.requests)
                })
        },
        save(){
            this.setDialogLoading(true)
            let date = moment(this.date).format('DD/MM/YYYY')
            let observations = []
            firebase.firestore()
                .collection('clientsRequests')
                .doc(this.dialogRequestQuoteData.id)
                .get()
                .then(ob => {
                    observations = ob.data().observations

                    if(this.quote === 'delete'){

                        observations.push({
                            author: firebase.auth().currentUser.displayName,
                            content: `Se cambia estatus de requerimiento a ${this.dialogRequestQuoteData.status}`,
                            date: this.date
                        })
                        
                        firebase.firestore()
                            .collection('clientsRequests')
                            .doc(this.dialogRequestQuoteData.id)
                            .update({
                                status: 'Pendiente',
                                quote: '',
                                observations
                            })
                            .then(() => {
                                this.$alertify.success(`Requerimiento actualizado al estado "Pendiente"`)
                                this.setDialogLoading(false)
                                })
                    }

                    if(this.quote === 'update'){

                        observations.push({
                            author: firebase.auth().currentUser.displayName,
                            content: `Se cambia estatus de requerimiento a ${this.dialogRequestQuoteData.status} con fecha ${date}`,
                            date: this.date
                        })

                        firebase.firestore()
                            .collection('clientsRequests')
                            .doc(this.dialogRequestQuoteData.id)
                            .update({
                                status: this.dialogRequestQuoteData.status,
                                quote: date,
                                observations
                            })
                            .then(() => {
                                this.$alertify.success(`Requerimiento actualizado al estado ${this.dialogRequestQuoteData.status}`)
                                this.setDialogLoading(false)
                                })
                    }

                    if(this.quote === 'ignore'){

                        observations.push({
                            author: firebase.auth().currentUser.displayName,
                            content: `Se cambia estatus de requerimiento a ${this.dialogRequestQuoteData.status}`,
                            date: this.date
                        })
                        
                        firebase.firestore()
                            .collection('clientsRequests')
                            .doc(this.dialogRequestQuoteData.id)
                            .update({
                                status: this.dialogRequestQuoteData.status,
                                observations
                            })
                            .then(() => {
                                this.$alertify.success(`Requerimiento actualizado al estado ${this.dialogRequestQuoteData.status}`)
                                this.setDialogLoading(false)
                                })
                    }
                })
        }
    },
    created() {
        this.date = this.dialogRequestQuoteData.quote.split("/").reverse().join("-")
        this.min = this.dialogRequestQuoteData.quote.split("/").reverse().join("-")
        this.fetchOptionStatus()
        this.fetchRequests()
    },
  }
</script>