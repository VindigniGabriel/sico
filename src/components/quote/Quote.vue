<template>
    <v-layout align-start justify-center row wrap>
        <v-flex xs12 class="text-right">
            <v-subheader>Gestión de citas</v-subheader>
            <v-btn color="teal lighten-3" outline small :disabled="quotes.length < 1" @click="downloadExcel">Excel
                <v-icon right>cloud_download</v-icon>
            </v-btn>
            <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 md5 class="text-center">
            <v-date-picker 
            v-model="date" 
            :reactive="true"
            locale="es"
            color="teal lighten-3"
            @input="updateQuote"
            :min="today"
            @change="listQuotes"
            ></v-date-picker>
        </v-flex>
        <v-flex xs12 md7>
            <Day/>
        </v-flex>
        <v-flex xs12 class="text-right">
            <v-subheader>Detalle de los requerimientos asignados para el {{dateFormat}}</v-subheader>
            <v-spacer></v-spacer>
            <Dialog/>
            <v-divider></v-divider>
        </v-flex>
        <v-flex xs12>
            <v-data-table
            :headers="headers"
            :items="quotes"
            :search="search"
            :pagination.sync="pagination"
            >
                <template 
                    v-slot:items="props" 
                >
                <tr @click="setDialogRequestQuote({status: true, data: props.item})" style="cursor: pointer">
                    <td>{{ props.item.created }} {{dateRelative(props.item.created)}}</td>
                    <td class="text-xs-left">{{ props.item.request }}</td>
                    <td class="text-xs-left">{{ props.item.technologie }}</td>
                    <td class="text-xs-left">{{ props.item.status }}</td>
                </tr>
                </template>
                <template v-slot:no-results>
                    Sin resultados para "{{ search }}".
                </template>
            </v-data-table>
            <Request v-if="dialogRequestQuote"/>
        </v-flex>
        <Loading/>
    </v-layout>
</template>

<script>
import firebase from "firebase";
import moment from 'moment'
import Dialog from './Dialog'
import Request from './Request'
import Day from './Day'
import Loading from '../loading/Loading'
import XLSX  from "xlsx"
import { mapMutations, mapState } from 'vuex'
moment().format()
export default {
    components:{
        Dialog,
        Request,
        Day,
        Loading
    },
    data() {
        return {
            quotes: [],
            disabledDates: {
                days: [6, 0]
            },
            today: new Date().toISOString().substr(0, 10),
            date: new Date().toISOString().substr(0, 10),
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
                { text: 'Requerimiento(s)', value: 'request', view: true },
                { text: 'Tec.', value: 'technologie', view: true, sortable: false },
                { text: 'Estatus', value: 'status', view: true, sortable: true }
            ],
        }
    },
    methods: {
        ...mapMutations(['setQuote', 'setDialogRequestQuote', 'setListQuote', 'setDialogLoading']),
        updateQuote(){
            this.setQuote(moment(this.date).format('DD/MM/YYYY'))
        },
        dateRelative(fecha){
            return moment(fecha).fromNow()
        },
        listQuotes(){
            this.setDialogLoading(true)
            var date = moment(this.date).format('DD/MM/YYYY')
            let requests = []
            firebase.firestore()
                .collection('clientsRequests')
                .where('idOffice', '==', this.idOffice)
                .where('quote', '==', date)
                .get()
                .then(s => {
                    if(s.empty) this.setDialogLoading(false)
                    requests = []
                    let client = null
                    this.quotes = []
                    s.forEach(request => {
                        firebase.firestore()
                            .collection('clientsRegisters')
                            .doc(request.data().clientId)
                            .get()
                            .then(c => {
                                if(c.empty) this.setDialogLoading(false)
                                firebase.firestore()
                                    .collection('officeCommercial')
                                    .doc(this.idOffice)
                                    .get()
                                    .then(office => {
                                        let ocm = office.data().name
                                        client = c.data()
                                        this.quotes.push({
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
                                    this.setDialogLoading(false)
                                    })
                            })
                        requests.push(request.data())
                    })
                    this.setListQuote(requests)
                })
        },
        downloadExcel(){
            let requests = []
            let observations = []
            let observation = ''
            this.quotes.forEach(request => {
                request.observations.forEach((ob, index) => {
                    observations.push(`${ob.date} - ${ob.content}. Realizado por :${ob.author}`)
                })
                requests.push({
                    Usuario: request.client.name,
                    Cédula: request.client.identify,
                    'Contacto 1': request.client.contact1,
                    'Contacto 2': request.client.contact2,
                    Requerimiento: request.request,
                    'Creado por': request.author,
                    Oficina: request.office,
                    Estatus: request.status,
                    'F. creación': request.created,
                    'F. cita': request.quote,
                    'F. cerrado': request.close,
                    Tecnología: request.technologie,
                    Télefono: request.phone,
                    Plan: request.subOption,
                    'Ult. Act.': request.update,
                    Observaciones: observations.join()
                })
            })
            let data = XLSX.utils.json_to_sheet(requests)
            const workbook = XLSX.utils.book_new()
            const filename = 'Citas GPCG-SICO'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `Citas_${this.date}.xlsx`)
        }
    },
    computed: {
        ...mapState(['idOffice', 'dialogRequestQuote']),
        dateFormat: state => moment(state.date).format('DD/MM/YYYY')
    },
    created(){
        this.updateQuote()
        this.listQuotes()
    }
}
</script>
