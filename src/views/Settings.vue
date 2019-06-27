<template>
    <v-container fill-height grid-list-lg>
        <v-layout align-center justify-center wrap>
            <v-flex xs12>
                <Settings/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Settings from '../components/settings/Settings'
  export default {
    data() {
      return {
      }
    },
    computed: {
    },
    components: {
      Settings
    },
    mounted() {
      
    }
  }
</script>
