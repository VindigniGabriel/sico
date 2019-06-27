<template>
  <v-layout row justify-center>

    <v-dialog
      v-model="dialogSettingsServices"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>
            <v-subheader>Agregar plan a {{dialogSettingsServicesTechnologie}}</v-subheader>
        </v-card-title>
        <form @submit.prevent="save">
        <v-card-text>
            <v-text-field
            color="teal"
            v-model="name"
            :error-messages="nameErrors"
            label="Nombre del plan"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
            ></v-text-field>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            small
            color="red"
            outline
            @click="close"
            >
            Cancelar
            </v-btn>
            <v-btn
            small
            color="teal"
            outline
            type="submit"
            >
            Agregar
            </v-btn>
        </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex';
  export default {
    mixins: [validationMixin],

    validations: {
      name: { required },
    },
    data () {
      return {
          name: ''
      }
    },
    computed: {
        ...mapState(['dialogSettingsServices', 'dialogSettingsServicesTechnologie']),
        nameErrors () {
            const errors = []
            if (!this.$v.name.$dirty) return errors
                !this.$v.name.required && errors.push('Asigne un nombre al plan.')
            return errors
        },
    },
    methods: {
        ...mapMutations(['setDialogSettingsServices']),
        save(){
            console.log('dd')
        },
        close () {
            this.$v.$reset()
            this.setDialogSettingsServices({
                status: false,
                technologie: ''
            })
            this.name = ''
        },
    }
  }
</script>
