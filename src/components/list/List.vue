<template>
  <v-container>
    <v-layout 
      row
      wrap>
      <v-flex xs12>
        <list-table></list-table>
      </v-flex>
      <Loading/>
    </v-layout>
  </v-container>
</template>

<script>
import ListTable from './ListTable'
import Loading from '../loading/Loading'
export default {
    components: {
        ListTable,
        Loading
    },
    data() {
        return {
        }
    },
}
</script>
