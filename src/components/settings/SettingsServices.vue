<template>
<div>
    <v-card class="elevation-12">

        <v-sheet
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
        >
            <v-toolbar color="teal lighten-3" dark>
                <v-toolbar-title>Planes por Técnologias</v-toolbar-title>
            </v-toolbar>
        </v-sheet>

        <v-card-text>
          <v-tabs
            dark
            color="primary"
            centered
            show-arrows
          >
            <v-tab
              v-for="(data, i) in dataTable"
              :key="i"
              :href="'#tab-' + i"
            >
              {{data.technologie}}
            </v-tab>

            <v-tabs-items>
              <v-tab-item
                v-for="(data, i) in dataTable"
                :key="i"
                :value="'tab-' + i"
              >
                
                
                <v-data-table
                  :headers="headersServices"
                  :items="data.services"
                  class="elevation-1"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td > 
                      <v-switch
                        color="teal lighten-3"
                        v-model="props.item.status"
                        @change="changeStatus(props.item.id, props.item.status, props.item.name)"
                      ></v-switch>
                    </td>
                    <td class="text-center"> 
                      <v-btn 
                      flat 
                      icon 
                      small 
                      @click="add({
                        technologie: data.technologie, 
                        data: props.item,
                        edit: true
                        })"
                      >
                      <v-icon>edit</v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <template v-slot:pageText="props">
                    Registros {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                  </template>
                  <template v-slot:footer>
                    <td :colspan="headersServices.length" class="text-right">
                      <v-btn 
                      color="teal lighten-3" 
                      outline 
                      small
                      dark
                      @click="add({
                        technologie: data.technologie, 
                        data: {},
                        edit: false
                        })"
                      >Agregar
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card-text>
    </v-card>
    <DialogSettingServices/>
</div>
</template>

<script>
import firebase from 'firebase'
import DialogSettingServices from './DialogSettingServices'
import { mapMutations } from 'vuex';
  export default {
    components: {
        DialogSettingServices
    },
    data () {
      return {
        headersServices: [
          {
            text: 'Planes',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Activo',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Configuraciones',
            sortable: false,
            align: 'center'
          }
        ],
        services: [],
        technologies: [],
        dataTable: []
      }
    },
    methods: {
        ...mapMutations(['setDialogSettingsServices']),
        buildDataTable(){
          this.dataTable = []
          var services = ''
          this.technologies.forEach(t => {
            services = this.services.filter(service => service.technologie === t.name)
            this.dataTable.push({
              technologie: t.name,
              services
            })
          })
        },
        add(data){
          this.setDialogSettingsServices({
            status: true,
            technologie: data.technologie,
            data: data.data,
            edit: data.edit
          })
        },
        changeStatus(id, status, name){
          firebase.firestore()
            .collection('services')
            .doc(id)
            .update({
              status
            })
            .then(()=>{
              var msj = status ? 'Activo' : 'Inactivo'
              this.$alertify.warning(`Plan ${name} ha sido modificado a ${msj}`)
            })
        }
    },
    created() {
      this.technologies = []
      firebase.firestore()
        .collection('typeLine')
        .onSnapshot(s => {
          s.forEach(technologie => {
            this.technologies.push(technologie.data())
          })
           firebase.firestore()
            .collection('services')
            .onSnapshot(s => {
              this.services = []
              s.forEach(service => {
                this.services.push(Object.assign(service.data(), {id: service.id}))
              })
              this.buildDataTable()
            })
        })
    },
  }
</script>