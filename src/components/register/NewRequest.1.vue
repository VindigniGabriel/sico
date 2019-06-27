<template>
    <v-dialog v-model="dialogNewRequest" max-width="500px" persistent>
        <v-card>
        <v-card-title>
            <span class="headline">Agregar Requerimiento</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
            <v-layout wrap>
                <v-flex xs12 sm6>
                <v-text-field 
                    v-model="date" 
                    label="Fecha/Hora" 
                    :disabled="true"
                    color="primary"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                <v-checkbox
                    v-model="lineNew"
                    label="Línea Nueva"
                    color="primary"
                ></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 v-if="!lineNew">
                <v-text-field
                    v-model="phone"
                    label="Línea"
                    hint="Ejemplo. (416) xxx - xxxx"
                    persistent-hint
                    single-line
                    :mask="mask"
                    color="primary"
                    type="tel"
                    :error-messages="phoneErrors"
                    @input="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 v-else>
                <v-text-field 
                    v-model="phone" 
                    label="Línea Nueva" 
                    color="primary"
                    disabled
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                <v-autocomplete
                    v-model="typeLine"
                    :items="typeLineItems"
                    label="Tipo de Línea"
                    color="primary"
                    @change="changeTypeLine"
                    :error-messages="typeLineErrors"
                    @input="$v.typeLine.$touch()"
                    @blur="$v.typeLine.$touch()"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                <v-autocomplete
                    v-model="requests"
                    :items="requestsItems"
                    label="Requerimiento(s)"
                    multiple
                    chips
                    persistent-hint
                    color="primary"
                    :error-messages="requestsErrors"
                    @input="$v.requests.$touch()"
                    @blur="$v.requests.$touch()"
                    :disabled="requestsItemsDisabled"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                <v-textarea
                    box
                    name="input-7-4"
                    label="Observaciones"
                    color="primary"
                    v-model="observations"
                    :counter="60"
                    :error-messages="observationsErrors"
                    @input="$v.observations.$touch()"
                    @blur="$v.observations.$touch()"
                ></v-textarea>
                </v-flex>
            </v-layout>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-3" flat @click="close" small outline>Cancelar</v-btn>
            <v-btn color="teal lighten-3" flat @click="save" small outline>Agregar</v-btn>
        </v-card-actions>
        </v-card>
        {{requestsItems}}
        {{requests}}
    </v-dialog>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'
import { validationMixin } from 'vuelidate'
import Cleave from 'vue-cleave-component'
import { required, minLength, maxLength} from 'vuelidate/lib/validators'
export default {
    mixins: [validationMixin],
    data() {
        return {
            requestsItemsDisabled: false,
            requestsItems: [],
            requests: [],
            phone: 416,
            lineNew: false,
            typeLine: '',
            observations: '',
            mask: 'phone',
        }
    },
    watch: {
        dialogNewRequest(val){
            val || this.close()
        },
        lineNew (val) {
            if(val){
                this.phone = '-'
                this.requestsItems = []
                this.requestsItems.push('Línea Nueva')
            }else{
                this.phone = '416'
                this.requestsItemsDisabled = false
            }
        }
    },
    validations() {
        if(this.lineNew){
            return {
            phone: { required },
            typeLine: { required },
            requests: { required },
            observations: { required }
            }
        }else{
            return {
            phone: { required, minLength: minLength(10) },
            typeLine: { required },
            requests: { required },
            observations: { required }
            }
        }
    },
    computed: {
        ...mapState(['dialogNewRequest', 'date', 'user', 'clientData', 'typeLineItems', 'idOffice']),
        phoneErrors () {
            const errors = []
            if (!this.$v.phone.$dirty) return errors
            !this.$v.phone.required && errors.push('Teléfono requerido.')
            !this.$v.phone.minLength && errors.push('Télefono no valido')
            return errors
        },
        typeLineErrors () {
            const errors = []
            if (!this.$v.typeLine.$dirty) return errors
            !this.$v.typeLine.required && errors.push('Tipo de Línea requerido.')
            return errors
        },
        requestsErrors () {
            const errors = []
            if (!this.$v.requests.$dirty) return errors
            !this.$v.requests.required && errors.push('Seleccione al menos un requerimiento.')
            return errors
        },
        observationsErrors () {
            const errors = []
            if (!this.$v.observations.$dirty) return errors
            !this.$v.observations.required && errors.push('Debe dejar un comentario breve.')
            return errors
        },
        /* requestsDynamic: (state) => {
            state.requests = ''
            if(state.lineNew){
                return ['Línea Nueva']
            }else{
                console.log(state.requestsItems)
                return state.requestsItems
            }
        }, */
    },
    methods: {
        ...mapMutations(['setDialogNewRequest', 'setClientRequests']),
        close () {
            this.$v.$reset()
            this.setDialogNewRequest(false)
            this.requests = '',
            this.phone = 416,
            this.lineNew = false,
            this.typeLine = '',
            this.observations = ''
        },
        changeTypeLine () {
            this.requestsItems = []
            const key = this.typeLineItems.indexOf(this.typeLine)
                if(key > -1){
                    firebase.firestore().collection('optionsRequests')
                        .onSnapshot( snapshot => {
                            this.requestsItems = []
                            snapshot.forEach(request => {
                            if(request.data().aplications[key])
                                this.requestsItems.push(request.data().name)
                            })
                        })
                }
        },
        save(){
            this.$v.$touch()
            var requests = []
            if (!this.$v.$invalid) {
                this.requests.forEach(request => {
                    requests.push({
                        clientId: this.clientData.clientId,
                        created: this.date,
                        request: request,
                        phone: this.phone,
                        lineNew: this.lineNew,
                        typeLine: this.typeLine,
                        author: firebase.auth().currentUser.displayName,
                        status: 'Pendiente',
                        update: this.date,
                        idOffice: this.idOffice,
                        observations: [
                            {date: this.date, 
                            content: this.observations,
                            author: firebase.auth().currentUser.displayName}
                        ]
                    })
                })
                requests.forEach(request => {
                    this.setClientRequests(request)
                    firebase.firestore()
                        .collection('clientsRequests')
                        .add(request)
                })
                this.close()
                this.$alertify.success("Requerimiento(s) agregado(s) con éxito.")
            }
        }
    }
}
</script>