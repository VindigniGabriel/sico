<template>
    <div>
        <v-card>
            <v-sheet
            class="v-sheet--offset mx-auto"
            elevation="12"
            max-width="calc(100% - 32px)"
            >
                <v-toolbar color="teal lighten-3" dark>
                    <v-toolbar-title>Historial de registros</v-toolbar-title>
                </v-toolbar>
            </v-sheet>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Filtrar"
                    single-line
                    hide-details
                    color="primary"
                ></v-text-field>
            </v-card-title>
            <v-card-title>
            <span class="font-weight-thin font-italic">Click en el registro para visualizar memo(s)</span>
            </v-card-title>
            <v-data-table
            :headers="headers"
            :items="requests"
            :search="search"
            :pagination.sync="pagination"
            >
                <template 
                    v-slot:items="props" 
                >
                <tr @click="viewRequest(props.item)" style="cursor: pointer">
                    <td>{{ props.item.created }} {{dateRelative(props.item.created)}}</td>
                    <td>{{ props.item.status }}</td>
                    <td>{{ props.item.identify }}</td>
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-left">{{ props.item.request }}</td>
                    <td class="text-xs-left">{{ props.item.phone }}</td>
                    <td class="text-xs-left">{{ props.item.technologie }}</td>
                    <td class="text-xs-left">{{dateRelative(props.item.update)}}</td>
                </tr>
                </template>
                <template v-slot:no-results>
                    Sin resultados para "{{ search }}".
                </template>
            </v-data-table>
        </v-card>
        <div class="text-xs-center">
        <v-dialog
          v-model="dialogObservations"
          width="500"
        >

          <v-card>
            <v-card-title
              primary-title
            >
                <span class="headline">Observaciones</span>
              <v-spacer></v-spacer>
              <span>{{item + 1}}/{{lengthObservations}}</span>
            </v-card-title>

            <v-card-text>
              <p>Creado el: {{date}}</p>
              <p>{{content}}</p>
              <p>Realizado por: {{author}}</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-show="(item > 0)"
                    color="cyan lighten-3"
                    flat
                    @click="back()"
                    outline
                    small
                >
                    Anterior 
                </v-btn>
                <v-btn
                    v-if="(item + 1 < lengthObservations)"
                    color="teal lighten-3"
                    flat
                    @click="next"
                    outline
                    small
                >
                    Siguiente 
                </v-btn>
                <v-btn
                    v-else
                    color="red lighten-3"
                    flat
                    @click="dialogObservations = false"
                    outline
                    small
                >
                    Cerrar
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
import firebase from 'firebase'
import { mapState, mapMutations } from 'vuex';
moment.locale('es')
export default {
    data() {
        return {
            dialogObservations : false,
            content: '',
            date: '',
            author: '',
            item: 0,
            lengthObservations: '',
            observations: '',    
            search: '',
            pagination: { rowsPerPage: 25 },
            requests: [],
            headers: [
                {
                text: 'Fecha de Creación',
                align: 'left',
                value: 'created',
                view: true
                },
                { text: 'Estatus', value: 'status', view: true, sortable: false },
                { text: 'Cédula', value: 'identify', view: true },
                { text: 'Usuario', value: 'name', view: true },
                { text: 'Requerimiento(s)', value: 'request', view: true },
                { text: 'Línea', value: 'phone', view: true, sortable: false },
                { text: 'Tec.', value: 'technologie', view: true, sortable: false },
                { text: 'Ult. Actualización', value: 'update', view: true, sortable: false }
            ],
        }
    },
    methods: {
        ...mapMutations(['setDialogLoading']),
        dateRelative(fecha){
            return moment(fecha).fromNow()
        },
        viewRequest(request){
        this.item = 0
        this.observations = request.observations
        this.lengthObservations = this.observations.length
        this.content = this.observations[this.item].content,
        this.date = this.observations[this.item].date,
        this.author = this.observations[this.item].author,
        this.dialogObservations = true
        }, 
        next(){
            this.item++,
            this.content = this.observations[this.item].content,
            this.date = this.observations[this.item].date,
            this.author = this.observations[this.item].author
        },
        back(){
            this.item--,
            this.content = this.observations[this.item].content,
            this.date = this.observations[this.item].date,
            this.author = this.observations[this.item].author
        },
        fetchData(){
            this.requests = []
            firebase.firestore()
                .collection('clientsRequests')
                .where('idOffice', '==', this.idOffice)
                .onSnapshot(requests => {
                    if(!requests.empty){
                        requests.forEach(request => {
                            firebase.firestore()
                                .collection('clientsRegisters')
                                .where('clientId', '==', request.data().clientId)
                                .get()
                                .then(dataClient => { 
                                    dataClient.forEach(client => {
                                        let object = {}
                                        object = Object.assign({}, request.data())
                                        object = Object.assign(object, {
                                            name : client.data().name,
                                            identify : client.data().identify
                                        })
                                        this.requests.push(object)
                                        this.setDialogLoading(false)
                                    })
                                })
                        })
                    }else{
                        this.setDialogLoading(false)
                    }
                })
        }
    },
    computed: {
        historyOcm: state => state.requests,
        ...mapState(['idOffice'])
    },
    created () {
        this.setDialogLoading(true)
        this.fetchData()
    },
}
</script>
