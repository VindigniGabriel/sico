<template>
    <v-container fill-height grid-list-lg>
        <v-layout align-center justify-center wrap>
            <v-flex xs12 sm6 md3>
                <Home/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Home from '@/components/home/Home'
  export default {
    components: {
      Home
    }
  }
</script>
