<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">

          <v-sheet
            class="v-sheet--offset mx-auto"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <v-toolbar color="teal lighten-3">
              <v-toolbar-title>Iniciar</v-toolbar-title>
            </v-toolbar>
          </v-sheet>

          <v-card-text>
            <v-form ref="form">
              <v-text-field 
                color="teal lighten-3"
                prepend-icon="person" 
                label="Email" 
                type="email"
                v-model="email"
                :error-messages="emailErrors"
                required
                @input="$v.email.$touch(), alertError = false"
                @blur="$v.email.$touch()"
              ></v-text-field>
              <v-text-field 
                color="teal lighten-3"
                prepend-icon="lock"  
                label="Contraseña" 
                type="password"
                v-model="pass"
                :error-messages="passErrors"
                required
                @input="$v.pass.$touch(), alertError = false"
                @blur="$v.pass.$touch()"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal lighten-3" outline small @click="submit">Entrar</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert
          :value="alertError"
          color="warning"
          icon="warning"
          outline
        >
          <span>
            Favor verifique los datos.
          </span>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
export default {
   mixins: [validationMixin],

  validations: {
    email: { required, email },
    pass: { required },
  },

  data() {
    return {
      pass: '',
      email: '',
      alertError: false
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('El Email debe ser válido')
        !this.$v.email.required && errors.push('El e-mail es requerido')
        return errors
      },
      passErrors () {
        const errors = []
        if (!this.$v.pass.$dirty) return errors
          !this.$v.pass.required && errors.push('La contraseña es requerido.')
        return errors
      },
  },
  methods: {
    submit () {
      this.$v.$touch()
      if(!this.$v.$invalid) this.login()
    },
    login(){
      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.pass)
          .then( msj => {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            this.$router.push('/')
          })
          .catch( error => {
            this.alertError = true
          })
    }
  },

  
}
</script>

<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>