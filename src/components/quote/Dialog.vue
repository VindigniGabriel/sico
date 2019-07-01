<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogQuote" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn outline v-on="on" small color="primary">Agregar</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogQuote = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Agregar cita(s) para el {{quote}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="save">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container grid-list-lg>
            <v-layout wrap>
                <v-flex xs12>
                  <v-card class="mb-3">
                    <v-card-title>
                      <v-subheader>Disponibilidad de aplicativos</v-subheader>
                    </v-card-title>  
                    <v-card-actions>
                      <v-switch
                      @change="loadRequests"
                        color="teal lighten-3"
                        small
                        v-for="(aplication, a) in aplications"
                        :key="a"
                        v-model="aplication.status"
                        :label="`${aplication.name}: ${aplication.status ? 'Disponible' : 'No Disponible'}`"
                      ></v-switch>
                    </v-card-actions>
                  </v-card>
                </v-flex>
                <v-flex xs12>
                  <v-card class="mb-3">
                    <v-card-title>
                      <v-subheader>Asignar requerimientos pendientes por técnologia</v-subheader>
                    </v-card-title>  
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        class="elevation-1"
                        :items="pendingRequests"
                        :pagination.sync="pagination"
                      >
                        <template v-slot:items="props">
                        <td>{{props.item.name}}</td>
                        <td v-for="(value, index) in props.item.values" :key="index" class="text-center">
                          <v-btn 
                          flat 
                          icon 
                          color="red lighten-3"
                          @click="desc(props.index, index)" 
                          :disabled="assingRequests[props.index].values[index] < 1"
                          >
                            <v-icon>remove</v-icon>
                          </v-btn>
                          <strong>
                            <span>{{assingRequests[props.index].values[index]}}/</span>
                            <span>{{value}}</span>
                          </strong>
                          <v-btn 
                          flat 
                          icon 
                          color="teal lighten-3" 
                          @click="add(props.index, index)"
                          :disabled="assingRequests[props.index].values[index] === value"
                          >
                            <v-icon>add</v-icon>
                          </v-btn>
                        </td>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-flex>
            </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import firebase from "firebase"
import { mapState } from 'vuex';
export default {
  data() {
    return{
      requestsOffice: [],
      pagination: { rowsPerPage: 25 },
      dialogQuote: false,
      aplications: [],
      pendingRequests: [],
      assingRequests: [],
      headers: [
        {
          text: 'Requerimientos',
          sortable: false,
          align: 'left',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    ...mapState(['idOffice', 'technologies', 'requestsItems', 'date', 'quote'])
  },
  watch: {
    dialogQuote(val){
      val || this.close()
    }
  },
  methods: {
    close(){
      this.loadAplications()
      this.pendingRequests = []
      this.assingRequests = []
    },
    loadHeaderTable(){
      this.headers = [{
        text: 'Requerimientos',
        sortable: false,
        align: 'left',
        value: 'name'
      }]
      this.technologies.forEach(technologie => {
        this.headers.push({
          text: technologie,
          sortable: false,
          align: 'center',
          value: 'aplications'
        })
      })
    },
    loadAplications(){
      firebase.firestore()
        .collection('aplications')
        .onSnapshot(a => {
          this.aplications = []
          a.forEach(aplication => {
            this.aplications.push(aplication.data())
          })
        })
    },
    loadRequests(){
      this.pendingRequests = []
      this.assingRequests = []
      var enabledAplications = this.aplications.filter(a => a.status === true).map(r => r.name)
        this.requestsItems.filter(r => r.face === true).forEach(rq => {
          var values = [0,0,0,0]
          this.assingRequests.push({
            name: rq.name,
            values: [0,0,0,0]
          }),
          rq.technologies.forEach(technologie => {
            var sizeI = technologie.aplications.filter(value => enabledAplications.includes(value))
            if(sizeI.length === technologie.aplications.length){
              var cantd = this.requestsOffice.filter(r => r.request === rq.name && r.technologie === technologie.name).length
              values[this.technologies.indexOf(technologie.name)] = cantd
            }
          })
          this.pendingRequests.push({
            name: rq.name,
            values
          })
        })
    },
    add(key, index){
      var assingRequests = []
      var values = []
      this.assingRequests.forEach((element, e) => {
        if(e != key){
          assingRequests.push(element)
        }else{
          element.values.forEach((value, v) => {
            if(v != index){
              values[v] = value
            }else{
              values[v] = value + 1
            }
          })
          assingRequests.push({
            name: element.name,
            values
          })
        }
      })
      this.assingRequests = assingRequests
    },
    desc(key, index){
      var assingRequests = []
      var values = []
      this.assingRequests.forEach((element, e) => {
        if(e != key){
          assingRequests.push(element)
        }else{
          element.values.forEach((value, v) => {
            if(v != index){
              values[v] = value
            }else{
              values[v] = value - 1
            }
          })
          assingRequests.push({
            name: element.name,
            values
          })
        }
      })
      this.assingRequests = assingRequests
    },
    save(){
      var office = ''
      var observations = []
      this.$store.commit('setMoment')
      firebase.firestore()
        .collection('officeCommercial')
        .doc(this.idOffice)
        .get()
        .then((office) => {
          office = office.data().name
          var observation = []
          this.assingRequests.forEach(assing => {
            assing.values.forEach((value, v) => {
              if(value > 0 ){
                firebase.firestore()
                  .collection('clientsRequests')
                  .where('request', '==', assing.name)
                  .where('technologie', '==', this.technologies[v])
                  .limit(parseInt(value))
                  .get()
                  .then(requests => {
                    requests.forEach((request, r) => {
                      observations = []
                      request.data().observations.forEach(o => {
                        observations.push(o)
                      })
                      observations.push({
                        author: firebase.auth().currentUser.displayName,
                        content: `Usuario citado para el ${this.quote} en la ${office}`,
                        date: this.date
                      })
                      firebase.firestore()
                        .collection('clientsRequests')
                        .doc(request.id)
                        .update({
                          status: 'con Cita',
                          update: this.date,
                          observations,
                          quote: this.quote
                        })
                    })
                  })
              }
            })
          })
          this.$alertify.success('Requeriemientos actualizados con éxito.')
          this.close()
          this.dialogQuote = false
        })
    }
  },
  created() {
    this.loadAplications()
    this.loadHeaderTable()
    firebase.firestore()
      .collection('clientsRequests')
      .where('idOffice', '==', this.idOffice)
      .where('status', '==', 'Pendiente')
      .onSnapshot(s => {
        this.requestsOffice = []
        s.forEach(request => {
          this.requestsOffice.push(request.data())
        })
      })
  }
}
</script>
