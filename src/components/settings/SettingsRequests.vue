<template>
<div>
    <v-card class="elevation-12">

        <v-sheet
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
        >
            <v-toolbar color="teal lighten-3" dark>
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
                  <v-btn 
                  flat 
                  icon 
                  small
                  @click="setDialogSettingsRequests({
                    status: true,
                    data: props.item,
                    edit: true
                  })">
                    <v-icon>settings</v-icon>
                  </v-btn>
                </td>
                </template>
                <template v-slot:pageText="props">
                  Registros {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                </template>
                <template v-slot:footer>
                  <td :colspan="headersRequest.length" class="text-right">
                    <v-btn color="teal lighten-3" outline small @click="setDialogSettingsRequests({
                      status: true,
                      edit: false
                    })">Agregar</v-btn>
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
      firebase.firestore()
        .collection('optionsRequests')
        .onSnapshot(s => {
          this.requests = []
          s.forEach(request => {
            this.requests.push(Object.assign(request.data(), {id:request.id}))
          })
        })
    },
  }

  /* [ { 
    "face": false, 
    "name": "Cambio de plan", 
    "phone": true, 
    "service": true, 
    "technologies": [ 
      { "aplications": [ "Sinapsis" ], 
      "name": "Pre/CDMA" }, 
      { "aplications": [ "RTB" ], 
      "name": "Pre/GSM" }, 
      { "aplications": [ "Xpert/CSM" ], 
      "name": "Cre/CDMA" }, 
      { "aplications": [ "Xpert/CSM" ], 
      "name": "Cre/GSM" } ],

    "id": "AAeaE7N5MJgBAVF1PmRC" } ] */
</script>