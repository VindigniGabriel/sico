<template>
    <v-navigation-drawer
        stateless
        value="true"
    >
        <v-list>
            <v-list-tile
                v-for="item in itemsMenu"
                :key="item.text"
                @click="setCustomerSupport(item.payload)"
            >
                <v-list-tile-action>
                <v-icon v-bind:class="[customerSupport === item.payload ? 'primary--text' : '']">{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        
            <v-list-group
                prepend-icon="filter_list"
            >
                <template v-slot:activator>
                <v-list-tile>
                    <v-list-tile-title>Filtrar requerimientos</v-list-tile-title>
                </v-list-tile>
                </template>
                <v-list-tile
                    v-for="(aplication, index) in aplications"
                    :key="index"
                >
                    <v-list-tile-action>
                        <v-switch
                            color="teal lighten-3"
                            v-model="aplication.status"
                            small
                            @change="setAplicationsStatus"
                        ></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                    <v-list-tile-title>{{`${aplication.name}: ${aplication.status ? 'Disponible' : 'No Disponible'}`}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import firebase from "firebase";
import { mapState, mapMutations } from 'vuex';
export default {
    data () {
      return {
        itemsMenu: [
            { icon: 'visibility', text: 'Presencial (con cita)', payload: true },
            { icon: 'visibility_off', text: 'No presencial', payload: false },
        ],
      }
    },
    computed: {
        ...mapState(['aplications', 'customerSupport'])
    },
    methods: {
        ...mapMutations(['setAplicationsStatus', 'setCustomerSupport']),
        loadAplications(){
            firebase.firestore()
                .collection('aplications')
                .onSnapshot(a => {
                    let aplications = []
                    a.forEach(aplication => {
                        aplications.push({
                            name: aplication.data().name,
                            status: true
                        })
                    })
                    this.$store.commit('setAplications', aplications)
                })
        },
    },
    created (){
        this.loadAplications()
    }
  }
</script>