<template>
    <v-dialog v-model="dialogNewRequest" max-width="500px" persistent>
        <v-card>
        <v-card-title>
            <span class="headline">Agregar Requerimiento</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm8>
                        <v-autocomplete
                            v-model="request"
                            :items="requestName"
                            label="Requerimiento"
                            persistent-hint
                            color="primary"
                            :error-messages="requestErrors"
                            @input="$v.request.$touch()"
                            @blur="$v.request.$touch()"
                            @change="updateRequest"
                        ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-autocomplete
                            v-model="technologie"
                            :items="requestClient.technologies"
                            label="Técnologia"
                            persistent-hint
                            color="primary"
                            :error-messages="technologieErrors"
                            @input="$v.technologie.$touch()"
                            @blur="$v.technologie.$touch()"
                            item-text="name"
                            @change="updateTechnologie"
                        ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-text-field
                            v-model="phone"
                            :label="labelPhone"
                            hint="Ejemplo. (416) xxx - xxxx"
                            persistent-hint
                            single-line
                            :mask="mask"
                            color="primary"
                            type="tel"
                            :error-messages="phoneErrors"
                            @input="$v.phone.$touch()"
                            @blur="$v.phone.$touch()"
                            :disabled="!requestClient.phone"
                        ></v-text-field>
                    </v-flex>
                     <v-flex xs12 sm6>
                        <v-autocomplete
                            v-model="subOption"
                            :items="subOptions"
                            label="Solicitud de plan"
                            persistent-hint
                            color="primary"
                            :error-messages="subOptionErrors"
                            @input="$v.subOption.$touch()"
                            @blur="$v.subOption.$touch()"
                            item-text="name"
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
    </v-dialog>
</template>

<script>
import firebase from 'firebase'
import { mapState, mapMutations } from 'vuex'
import { validationMixin } from 'vuelidate'
import Cleave from 'vue-cleave-component'
import { required, minLength, maxLength} from 'vuelidate/lib/validators'
export default {
    mixins: [validationMixin],
    data() {
        return {
            labelPhone: 'Línea',
            requestClient: {
                phone: false
            },
            request: '',
            phone: 416,
            observations: '',
            mask: 'phone', //
            selectPlans: true,
            subOption: '',
            technologie: '',
            requestName: [],
            subOptions: [],
            requests: [],
            /* requests: [
                {name: 'Cambio de Plan',
                phone: true,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: ['PlanPreG 1', 'PlanPreG 2'],
                    aplications: ['RTB']},
                    {name: 'Pre/CDMA',
                    subRequest: ['PlanPreC 1', 'PlanPreC 2'],
                    aplications: ['SINAPSIS']},
                    {name: 'Cre/GSM',
                    subRequest: ['PlanCreG 1', 'PlanCreG 2'],
                    aplications: ['XPERT/CSM']},
                    {name: 'Cre/CDMA',
                    subRequest: ['PlanCreC 1', 'PlanCreC 2'],
                    aplications: ['XPERT/CSM']}
                ]},
                {name: 'Venta de Sim Card',
                phone: true,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: []},
                    {name: 'Cre/GSM',
                    subRequest: []}
                ]},
                {name: 'Línea Nueva',
                phone: false,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: ['PlanPre 1', 'PlanPre 2']},
                    {name: 'Cre/GSM',
                    subRequest: ['PlanCre 1', 'PlanCre 2']}
                ]}
            ] */
        }
    },
    watch: {
        dialogNewRequest(val){
            val || this.close()
        }
    },
    validations() {
        if(!this.requestClient.phone){
            return {
                phone: { },
                technologie: { required },
                request: { required },
                observations: { required },
                subOption: { required }
            }
        }else{
            return {
                phone: { required, minLength: minLength(10) },
                technologie: { required },
                request: { required },
                observations: { required },
                subOption: { required }
            }
        }
    },
    computed: {
        ...mapState(['dialogNewRequest', 'date', 'user', 'clientData', 'idOffice']),
        phoneErrors () {
            if(this.requestClient.phone){
                const errors = []
                if (!this.$v.phone.$dirty) return errors
                !this.$v.phone.required && errors.push('Teléfono requerido.')
                !this.$v.phone.minLength && errors.push('Télefono no valido')
                return errors
            }
        },
        technologieErrors () {
            const errors = []
            if (!this.$v.technologie.$dirty) return errors
            !this.$v.technologie.required && errors.push('Tipo de Línea requerido.')
            return errors
        },
        requestErrors () {
            const errors = []
            if (!this.$v.request.$dirty) return errors
            !this.$v.request.required && errors.push('Seleccione un requerimiento.')
            return errors
        },
        subOptionErrors() {
            const errors = []
            if (!this.$v.subOption.$dirty) return errors
            !this.$v.subOption.required && errors.push('Seleccione un plan.')
            return errors
        },
        observationsErrors () {
            const errors = []
            if (!this.$v.observations.$dirty) return errors
            !this.$v.observations.required && errors.push('Debe dejar un comentario breve.')
            return errors
        }
    },
    methods: {
        ...mapMutations(['setDialogNewRequest', 'setClientRequests']),
        close () {
            this.$v.$reset()
            this.setDialogNewRequest(false)
            this.request = ''
            this.phone = 416
            this.observations = ''
            this.technologie = ''
            this.subOption = ''
        },
        save(){
            this.$v.$touch()
            var requests = []
            if (!this.$v.$invalid) {
                requests.push({
                    clientId: this.clientData.clientId,
                    created: this.date,
                    request: this.request,
                    phone: this.phone,
                    technologie: this.technologie,
                    author: firebase.auth().currentUser.displayName,
                    status: 'Pendiente',
                    update: this.date,
                    idOffice: this.idOffice,
                    subOption: this.subOption,
                    observations: [
                        {date: this.date, 
                        content: this.observations,
                        author: firebase.auth().currentUser.displayName}
                    ]
                })
                requests.forEach(request => {
                    this.setClientRequests(request)
                    firebase.firestore()
                        .collection('clientsRequests')
                        .add(request)
                })
                this.close()
                this.$alertify.success("Requerimiento agregado con éxito.")
            }
        },
        updateRequest(){
            this.technologie = ''
            this.subOption = ''
            this.subOptions = []
            this.requests.filter(request => request.name === this.request).forEach(r => {
                this.requestClient = r
            })
            if(this.requestClient.phone){
                this.phone = '416'
                this.labelPhone = 'Línea'
            }else{
                this.phone = null
                this.labelPhone = 'No Aplica'
            }
            
        },
        updateTechnologie(){
            this.subOption = ''
            this.requestClient.technologies.filter(result => result.name === this.technologie).forEach(r => {
                this.subOptions =  r.subRequest
            })
            if(this.subOptions.length > 0){
                this.subOption = ''
            }else{
                this.subOptions = ['No Aplica']
            }
        }
    },
    mounted() {
        firebase.firestore()
            .collection('optionsRequests')
            .onSnapshot(s => {
                this.requestName = []
                this.requests = []
                s.forEach(request => {
                    this.requestName.push(request.data().name)
                    this.requests.push(request.data())
                })
            })
        
    },
}
</script>