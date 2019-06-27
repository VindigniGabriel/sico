<template>
  <v-container>
    <v-layout wrap>
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
    </v-layout>
  </v-container>
</template>

<script>
import SettingsRequests from './SettingsRequests'
import SettingsServices from './SettingsServices'
import SettingsManagements from './SettingsManagements'
import SettingsOffices from './SettingsOffices'
export default {
  components: {
    SettingsRequests,
    SettingsServices,
    SettingsManagements,
    SettingsOffices
  }
}
</script>