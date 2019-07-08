<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 class="text-right">
        <v-subheader>Configuraciones</v-subheader>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 md6>
        <SettingsRequests />
      </v-flex>
      <v-flex xs12 md6>
        <SettingsServices />
      </v-flex>

      <v-flex xs12 md6>
      </v-flex>
      <v-flex xs12 md6>
      </v-flex>
      <Loading/>
    </v-layout>
  </v-container>
</template>

<script>
import SettingsRequests from './SettingsRequests'
import SettingsServices from './SettingsServices'
import SettingsManagements from './SettingsManagements'
import SettingsOffices from './SettingsOffices'
import Loading from '../loading/Loading'
export default {
  components: {
    SettingsRequests,
    SettingsServices,
    SettingsManagements,
    SettingsOffices,
    Loading
  }
}
</script>