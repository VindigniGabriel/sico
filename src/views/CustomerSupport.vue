<template>
  <v-container fill-height grid-list-lg>
      <v-layout align-center justify-center wrap>
          <v-flex xs12>
              <customer-support/>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import customerSupport from '@/components/customerSupport/customerSupport'
export default {
    components: {
        customerSupport
    }
  }
</script>