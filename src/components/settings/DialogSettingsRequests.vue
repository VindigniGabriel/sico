<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogSettingsRequests" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="save">Guardar</v-btn>
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
                      v-model="request.service"
                      :label="`Activación de plan: ${request.service ? 'Si': 'No'}`"
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
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
      return {
        request: '', //Objeto requerimientos {name, phone, technologies, face, service}
        aplications: [], //Facturadores {name, status}
        technologiesAssing: [] // "name": Tecnologie, "add": true/false, "aplications": Ej. [ "Sinapsis" ]
      }
    },
  computed: {
    ...mapState(['dialogSettingsRequests', 'technologies', 'dialogSettingsRequestsEdit', 'dialogSettingsRequestsData']),
    validationNewRequest: state => {
      var filter = state.technologiesAssing.filter(r => r.add === true && r.aplications.length > 0)
      return filter.length > 0 ? true : false 
    }
  },
  watch: {
    dialogSettingsRequests(val){
      val || this.close()
    },
    dialogSettingsRequestsEdit(val){

      if(val){
          this.technologiesAssing= []
          this.request = this.dialogSettingsRequestsData

          this.technologies.forEach((t,i) => {

            var validation = this.dialogSettingsRequestsData.technologies.filter(req => req.name === t)
            if(validation.length > 0){
              this.technologiesAssing.push({
                name: t,
                add: true,
                aplications: validation[0].aplications
              })
            }else{
              this.technologiesAssing.push({
                name: t,
                add: false,
                aplications: ''
              })
            }

          })
      }else{
        this.buildRequest()
      }
    }
  },
  methods: {
    ...mapMutations(['setDialogSettingsRequests', 'setDialogLoading']),
    buildRequest(){
      this.request = {
        name: '',
        phone: true,
        technologies: [],
        face: true,
        service: false
      }
    },
    save(){
      var error = false

      if(!this.validationNewRequest){
        this.$alertify.error('Error!. El requerimiento no posee asignación.')
        error = true
      }

      if(this.request.name === ''){
        this.$alertify.error('Error!. El requerimiento no posee un nombre.')
        error = true
      }

      this.request.technologies = []

      //se inserta array de las asignaciones a request
      this.technologiesAssing.forEach(technologie => {

        if(technologie.add){
            this.request.technologies.push({
            aplications: technologie.aplications,
            name: technologie.name,
          })
        }

      })

      if(!error){
        this.setDialogLoading(true)
        if(this.dialogSettingsRequestsEdit){
          this.proccessSettingsRequestEdit()
        }else{
          this.proccessSettingsRequest()
        }
      }
    },
    proccessSettingsRequest(){
      firebase.firestore()
        .collection('optionsRequests')
        .add(this.request)
        .then(() => {
          this.$alertify.success('Requerimiento agregado con éxito.')
          this.close()
        })
        .catch(() => {
          this.$alertify.error(`Error!`)
          this.close()
        })
    },
    proccessSettingsRequestEdit(){
      firebase.firestore()
        .collection('optionsRequests')
        .doc(this.request.id)
        .update(this.request)
        .then( () => {
          this.$alertify.success('Requerimiento actualizado con éxito.')
          this.close()
        })
        .catch( () => {
          this.$alertify.error(`Error!`)
          this.close()
        })
    },
    close(){
      this.setDialogSettingsRequests({
        status: false,
        edit: false
      })
      this.updateTechnologiesAssing()
      this.setDialogLoading(false)
    },
    updateTechnologiesAssing(){
      this.technologiesAssing = []

      this.technologies.forEach(technologie => {
        this.technologiesAssing.push({
            name: technologie,
            add: false,
            aplications: ''
          })
      })

      this.buildRequest()

    }
  },
  created() {
    this.aplications = [] //Facturadores {name, status}

    firebase.firestore()
      .collection('aplications')
      .get()
      .then(aplication => {
        aplication.forEach(a => {
          this.aplications.push(a.data())
        })
        this.updateTechnologiesAssing()
      })
  }
}
</script>
