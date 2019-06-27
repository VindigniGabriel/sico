<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogSettingsRequests" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="setDialogSettingsRequests(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Configuración de los Requerimientos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="save" :disabled="buttonSave">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
          <v-subheader>General</v-subheader>
              <v-container grid-list-lg>
                <v-layout wrap>
                  <v-flex xs12 sm6 md3>
                    <v-text-field
                      color="teal lighten-3"
                      v-model="request.name"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-switch
                      color="teal lighten-3"
                      v-model="request.face"
                      :label="`Atención presencial: ${request.face ? 'Si': 'No'}`"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-switch
                      color="teal lighten-3"
                      v-model="request.phone"
                      :label="`Usuario actual: ${request.phone ? 'Si': 'No'}`"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-switch
                      color="teal lighten-3"
                      v-model="service"
                      :label="`Activación de plan: ${service ? 'Si': 'No'}`"
                    ></v-switch>
                  </v-flex>
                </v-layout>
              </v-container>
              
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>Asignaciones</v-subheader>
          <v-list-tile avatar v-for="(technologie, index) in technologiesAssing" :key="index">
            <v-list-tile-action>
              <v-switch
              color="teal lighten-3"
              v-model="technologie.add"
              ></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{technologie.name}}
                <v-icon v-if="technologie.add">check</v-icon>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Seleccione para asignar requerimiento a la técnologia {{technologie.name}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
             <v-list-tile-action>
              
              <v-autocomplete
                v-model="technologie.aplications"
                multiple
                :items="aplications"
                label="Depende de:"
                item-text="name"
                :disabled="!technologie.add"
              ></v-autocomplete>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import firebase from 'firebase'
import { mapState, mapMutations } from 'vuex';
  export default {
    data () {
      return {
        request: '',
        aplications: [],
        service: false,
        phone: false,
        requestName: '',
        technologiesAssing: [],
        services: []
      }
    },
    computed: {
      ...mapState(['dialogSettingsRequests', 'technologies']),
      buttonSave: state => state.request.name != '' ? false : true
    },
    methods: {
      ...mapMutations(['setDialogSettingsRequests']),
      buildRequest(){
        this.request = {
          name: '',
          phone: true,
          technologies: [],
          face: true
        }
      },
      save(){
        var service
        this.request.technologies = []
        this.technologiesAssing.forEach(technologie => {

          service = this.service ? this.services.filter(service => service.technologie === technologie.name && service.status) : ['No Aplica']
          
          if(technologie.add){
              this.request.technologies.push({
              aplications: technologie.aplications,
              name: technologie.name,
              subRequest: service
            })
          }

        })

        this.proccessSettingsRequest()

      },
      proccessSettingsRequest(){
        firebase.firestore()
          .collection('optionsRequests')
          .add(this.request)
          .then(r => {
            this.$alertify.success('Requerimiento agregado con éxito.')
          })
          .catch(e => {
            this.$alertify.error(`Error!. ${e}`)
          })
      }
    },
    created() {
      this.buildRequest()
      this.aplications = []
      this.technologiesAssing = []
      this.services = []

      firebase.firestore()
        .collection('aplications')
        .get()
        .then(aplication => {
          aplication.forEach(a => {
            this.aplications.push(a.data())
          })
        })

      firebase.firestore()
        .collection('services')
        .get()
        .then(service => {
          service.forEach(s => {
            this.services.push(s.data())
          })
        })

      this.technologies.forEach(technologie => {
        this.technologiesAssing.push({
          name: technologie,
          add: false,
          aplications: ''
        })
      });
    },
  }
</script>