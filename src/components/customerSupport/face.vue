<template>
    <div>
        <v-flex xs12 class="text-right">
            <v-subheader>Detalle de los requerimientos con atención presencial (con cita confirmada)</v-subheader>
            <v-spacer></v-spacer>
            <Dialog/>
            <v-divider></v-divider>
        </v-flex>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                Requerimientos
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="headers"
                :items="quotesFilter"
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
            </v-card>
            <Request v-if="dialogRequestQuote"/>
        </v-flex>
        <Loading/>
    </div>
</template>

<script>
import firebase from 'firebase'
import { mapMutations, mapState, mapGetters } from 'vuex'
import moment from 'moment'
import Loading from '../loading/Loading'
import Request from '../quote/Request'
export default {
    data: ()=>({
        search: '',
        pagination: { rowsPerPage: 25 },
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
    }),
    components:{
        Loading,
        Request
    },
    computed: {
        ...mapState(['idOffice', 'dialogRequestQuote', 'quotesFilter']),
    },
    methods: {
        ...mapMutations(['setDialogLoading', 'setListQuote', 'setDialogRequestQuote']),
        dateRelative(fecha){
            return moment(fecha).fromNow()
        }
    },
    created() {
        this.$store.dispatch('setQuotes')
    },
}
</script>