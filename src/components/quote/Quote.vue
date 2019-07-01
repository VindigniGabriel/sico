<template>
    <v-layout align-start justify-center row wrap>
        <v-flex xs12 md5 class="text-center">
            <v-date-picker 
            v-model="date" 
            :reactive="true"
            locale="es"
            color="primary"
            @input="updateQuote"
            :min="today"
            @change="listQuotes"
            ></v-date-picker>
        </v-flex>
        <v-flex xs12 md7>
            <v-layout row justify-space-between align-center wrap>
                <v-flex xs6>
                    <span>
                        Requerimientos asignados para el {{dateFormat}}
                    </span>
                </v-flex>
                <v-flex xs6 class="text-right">
                    <Dialog/>
                </v-flex>
            </v-layout>                                 
            <v-data-table
            :headers="headers"
            :items="quotes"
            :search="search"
            :pagination.sync="pagination"
            >
                <template 
                    v-slot:items="props" 
                >
                <tr @click="viewRequest(props.item)">
                    <td>{{ props.item.created }} {{dateRelative(props.item.created)}}</td>
                    <td class="text-xs-left">{{ props.item.request }}</td>
                    <td class="text-xs-left">{{ props.item.phone }}</td>
                    <td class="text-xs-left">{{ props.item.technologie }}</td>
                </tr>
                </template>
                <template v-slot:no-results>
                    Sin resultados para "{{ search }}".
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import firebase from "firebase";
import moment from 'moment'
import Dialog from './Dialog'
import { mapMutations } from 'vuex';
export default {
    components:{
        Dialog
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
                { text: 'Línea', value: 'phone', view: true, sortable: false },
                { text: 'Tec.', value: 'technologie', view: true, sortable: false },
            ],
        }
    },
    methods: {
        ...mapMutations(['setQuote']),
        updateQuote(){
            this.setQuote(moment(this.date).format('DD/MM/YY'))
        },
        dateRelative(fecha){
            return moment(fecha).fromNow()
        },
        listQuotes(){
            var date = moment(this.date).format('DD/MM/YY')
            firebase.firestore()
                .collection('clientsRequests')
                .where('quote', '==', date)
                .onSnapshot(s => {
                    this.quotes = []
                    s.forEach(request => {
                        this.quotes.push({
                            created: request.data().created,
                            request: request.data().request,
                            phone: request.data().phone,
                            technologie: request.data().technologie
                        })
                    })
                })
        }
    },
    computed: {
        dateFormat: state => moment(state.date).format('DD/MM/YY')
    },
    created(){
        this.updateQuote()
        this.listQuotes()
    }
}
</script>
