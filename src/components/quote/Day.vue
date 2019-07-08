<template>
    <v-card>
        <v-card-title>
        Citas por requerimiento
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="search"
            label="Filtrar"
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
        <v-data-table
        :headers="headers"
        :items="listQuote"
        :search="search"
        :rows-per-page-items="[5]"
        >
        <template v-slot:items="props">
            <td>{{ props.item.request }}</td>
            <td class="text-xs-center warning--text">{{ props.item.wait }}</td>
            <td class="text-xs-center green--text">{{ props.item.check }}</td>
            <td class="text-xs-center blue--text">{{ props.item.processed }}</td>
            <td class="text-xs-center blue--text">{{ props.item.close }}</td>
            <td class="text-xs-center red--text">{{ props.item.notProcessed }}</td>
        </template>
        <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
            No hay resultados para "{{ search }}".
            </v-alert>
        </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data(){
        return{
            search: '',
            headers: [
                { 
                    text: 'Requerimiento',
                    align: 'center',
                    value: 'request'
                },
                {
                    text: 'Por confirmar',
                    aling: 'center',
                    value: 'wait'
                },
                {
                    text: 'Confirmado',
                    aling: 'center',
                    value: 'check'
                },
                {
                    text: 'Procesado',
                    aling: 'center',
                    value: 'processed'
                },
                {
                    text: 'Cerrado',
                    aling: 'center',
                    value: 'close'
                },
                {
                    text: 'No Procede',
                    aling: 'center',
                    value: 'notProcessed'
                }
            ]
        }
    },
    computed: {
        ...mapState(['listQuote'])
    },
}
</script>