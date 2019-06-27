<template>
<div>
    <v-card class="elevation-12">

        <v-sheet
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
        >
            <v-toolbar color="teal lighten-3">
                <v-toolbar-title>Requerimientos</v-toolbar-title>
            </v-toolbar>
        </v-sheet>

        <v-card-text>
            <v-data-table
                :headers="headersRequest"
                :items="requests"
                class="elevation-1"
            >
                <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td class="text-center"> 
                  <v-btn flat icon small>
                    <v-icon>settings</v-icon>
                  </v-btn>
                </td>
                </template>
                <template v-slot:pageText="props">
                  Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                </template>
                <template v-slot:footer>
                  <td :colspan="headersRequest.length" class="text-right">
                    <v-btn color="teal lighten-3" outline small @click="setDialogSettingsRequests(true)">Agregar</v-btn>
                  </td>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <DialogSettingsRequests/>
</div>
</template>

<script>
import firebase from 'firebase'
import DialogSettingsRequests from './DialogSettingsRequests'
import { mapMutations } from 'vuex';
  export default {
    components: {
        DialogSettingsRequests
    },
    data () {
      return {
        headersRequest: [
          {
            text: 'Requerimiento',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Configuraciones',
            sortable: false,
            align: 'center'
          }
        ],
        requests: []
      }
    }, 
    methods: {
        ...mapMutations(['setDialogSettingsRequests'])
    },
    created() {
      this.requests = []
      firebase.firestore()
        .collection('optionsRequests')
        .onSnapshot(s => {
          s.forEach(request => {
            this.requests.push({
              name: request.data().name,
            })
          })
        })
    },
  }
</script>