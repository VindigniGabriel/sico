<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-subheader>
        Requerimiento(s)
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn flat icon :disabled="!addRequest" v-on="on" @click="$store.commit('setDialogNewRequest', true)">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>Agregar requerimiento</span>
        </v-tooltip>
      </v-subheader>
      <v-progress-linear :indeterminate="loading"></v-progress-linear>
      <v-list two-line v-if="!loading">
          <template v-for="(item, index) in clientRequests">
            <v-list-tile
              :key="index"
              avatar
              ripple
              @click="viewRequest(item)"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>phone_android</v-icon>{{ item.phone }} - {{ item.request}} - {{ item.technologie }}
                </v-list-tile-title>
                <v-list-tile-sub-title>Creado el: {{ item.created }} por OC: {{item.ocm}}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.status }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
          <new-request></new-request>
    </v-flex>
    <v-flex xs12>
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
                color="cyan lighten-2"
                flat
                @click="back()"
                outline
                small
              >
                Anterior 
              </v-btn>
              <v-btn
                v-if="(item + 1 < lengthObservations)"
                color="teal lighten-2"
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
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from 'firebase'
import NewRequest from './NewRequest'
import { mapState, mapMutations } from "vuex";
  export default {
    components: {
      NewRequest
    },
    data () {
      return {
        loading: false,
        dialogObservations : false,
        content: '',
        date: '',
        author: '',
        item: 0,
        lengthObservations: '',
        observations: ''
      }
    },
    computed: {
      ...mapState(['clientData', 'clientExists', 'clientRequests', 'addRequest']),
    },
    methods: {
      ...mapMutations(['setClientRequests']),
      fetchData () {
        if(this.clientExists){
          this.loading = true
          firebase.firestore()
          .collection('clientsRequests')
          .where("clientId", "==", this.clientData.clientId)
          .get()
          .then( requests => {
            if(!requests.empty){
              this.setClientRequests()
              requests.forEach(request => {
                firebase.firestore()
                  .collection('officeCommercial')
                  .where(firebase.firestore.FieldPath.documentId(), '==', request.data().idOffice)
                  .get()
                  .then(office => {
                    office.forEach(o => {
                      var clientRequestsUpdate = {}
                      clientRequestsUpdate = Object.assign({},request.data())
                      clientRequestsUpdate = Object.assign(clientRequestsUpdate,{
                        ocm: o.data().name
                      })
                      this.setClientRequests(clientRequestsUpdate)
                    })
                  })
                  this.loading = false
                })
            }else{
              this.loading = false
            }
          })
        }
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
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    }
  }
</script>