<template>
  <v-layout row justify-center>

    <v-dialog
      v-model="dialogSettingsServices"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>
            <v-subheader>{{dialogSettingsServicesEdit? 'Editar': 'Agregar'}} plan {{dialogSettingsServicesTechnologie}}</v-subheader>
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
            <v-autocomplete
                v-show="dialogSettingsServicesEdit"
                v-model="technologie"
                :items="technologies"
                label="Técnologia"
                persistent-hint
                color="teal"
                :error-messages="technologieErrors"
                @input="$v.technologie.$touch()"
                @blur="$v.technologie.$touch()"
                item-text="name"
            ></v-autocomplete>
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
            {{dialogSettingsServicesEdit? 'Actualizar' : 'Agregar'}}
            </v-btn>
        </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import firebase from 'firebase'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex';
  export default {
    mixins: [validationMixin],

    validations: {
      name: { required },
      technologie: { required }
    },
    data () {
        return {
            name: '',
            technologie: '',
            technologies: []
        }
    },
    computed: {
        ...mapState(['dialogSettingsServices', 'dialogSettingsServicesTechnologie', 'dialogSettingsServicesData', 'dialogSettingsServicesEdit']),
        nameErrors () {
            const errors = []
            if (!this.$v.name.$dirty) return errors
                !this.$v.name.required && errors.push('Asigne un nombre al plan.')
            return errors
        },
        technologieErrors () {
            const errors = []
            if (!this.$v.technologie.$dirty) return errors
                !this.$v.technologie.required && errors.push('Asigne una técnologia al plan.')
            return errors
        }
    },
    watch: {
      dialogSettingsServicesEdit(val){
          if(val){
            this.name = this.dialogSettingsServicesData.name
            this.technologie = this.dialogSettingsServicesData.technologie
          }
      }
    },
    methods: {
        ...mapMutations(['setDialogSettingsServices']),
        save(){
            if(this.dialogSettingsServicesEdit){
                firebase.firestore()
                .collection('services')
                .doc(this.dialogSettingsServicesData.id)
                    .update({
                        name: this.name,
                        technologie: this.technologie
                    })
                    .then(msj => {
                        this.$alertify.success(`Plan ${this.name} actualizado, para ${this.technologie}`)
                        this.close()
                    })
                    .catch( e => {
                        console.log(e)
                        this.$alertify.error(`Error!. Plan ${this.name} NO actualizado, para ${this.technologie}`)
                        this.close()
                    })
            }else{
                firebase.firestore()
                .collection('services')
                    .add({
                        name: this.name,
                        status: true,
                        technologie: this.dialogSettingsServicesTechnologie
                    })
                    .then(msj => {
                        this.$alertify.success(`Plan ${this.name} creado, para ${this.technologie}`)
                        this.close()
                    })
                    .catch( e => {
                        console.log(e)
                        this.$alertify.error(`Error!. Plan ${this.name} NO creado, para ${this.technologie}`)
                        this.close()
                    })
            }
            
        },
        close () {
            this.$v.$reset()
            this.setDialogSettingsServices({
                status: false,
                technologie: '',
                data: ''
            })
            this.name = '',
            this.technologie = ''
        },
    },
    mounted(){
        firebase.firestore()
            .collection('typeLine')
            .get()
            .then(t => {
                this.technologies = []
                t.forEach(technologie => {
                    this.technologies.push(technologie.data())
                })
            })
    }
  }
</script>
