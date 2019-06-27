<template>
    <v-container fill-height grid-list-lg>
        <v-layout align-center justify-center wrap>
            <v-flex xs12>
                <Register/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Register from '@/components/register/Register'
  export default {
    components: {
      Register
    }
  }
</script>
