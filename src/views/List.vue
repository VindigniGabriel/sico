<template>
  <v-container fill-height grid-list-lg>
      <v-layout align-center justify-center wrap>
          <v-flex xs12>
            <List/>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  import List from '@/components/list/List'

  export default {
    components: {
      List
    }
  }
</script>