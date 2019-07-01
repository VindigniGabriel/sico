<template>
    <v-container fill-height grid-list-lg>
        <v-layout align-center justify-center wrap>
            <v-flex xs12>
                <Quote/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Quote from '@/components/quote/Quote'
  export default {
    components: {
      Quote
    }
  }
</script>
