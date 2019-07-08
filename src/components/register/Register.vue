<template>
  <v-container fill-height grid-list-lg>
    <v-layout 
      row
      wrap
      justify-center
    >
      <v-flex xs12 class="text-right">
        <v-subheader>Usuario <v-icon medium color='primary'>add</v-icon> requerimientos</v-subheader>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-btn flat color="teal lighten-3" @click="back">
          <v-icon>reply</v-icon>
          Volver
        </v-btn>
      </v-flex>
      <v-flex xs12 md4>
        <UserData/>
      </v-flex>
      <v-flex xs12 md8>
        <Requests/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Requests from './Requests'
import UserData from './UserData'
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Requests,
    UserData
  },
  computed: {
    ...mapState(['clientExists'])
  },
  methods: {
    ...mapMutations(['setClientRequests']),
    back(){
      this.$router.go(-1)
    }
  },
  created(){
    this.setClientRequests()
  }
}
</script>