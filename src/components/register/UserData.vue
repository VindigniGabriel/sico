<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
            <v-subheader
            >
                Información del usuario
                <v-spacer></v-spacer>
                <v-btn flat icon @click="editUserData" v-if="edit">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn 
                    flat 
                    icon 
                    @click="saveUserData" 
                    v-else
                    :disabled="!valid || validIdentify"
                >
                    <v-icon>save</v-icon>
                </v-btn>
            </v-subheader>
            <v-divider></v-divider>
                
                <p v-if="edit">Nombre: {{clientData.name}}</p>
                <v-text-field
                    v-else
                    :rules="nameRules"
                    label="Nombre"
                    color="deep-orange lighten-1"
                    :value="clientData.name"
                    required
                    v-model="clientData.name"
                ></v-text-field>  
                <p v-if="edit">Cédula: {{clientData.identify}}</p>
                <cleave
                    v-else
                    required
                    :options="optionsCleaveIdentify" 
                    class="form-control" 
                    color="deep-orange lighten-1"
                    type="tel"
                    :value="clientData.identify"
                    :rules="identifyRules"
                    v-model="clientData.identify"
                    >
                </cleave>
                <p v-if="edit">Contacto 1: {{clientData.contact1}}</p>
                <v-text-field
                    v-else
                    required
                    v-model="clientData.contact1"
                    label="Tél. Contacto 1 (212)xxx-xxxx"
                    :mask="mask"
                    color="dark"
                    type="tel"
                    :rules="contactRules"
                ></v-text-field> 
                <p v-if="edit">Contacto 2: {{clientData.contact2}}</p>
                <v-text-field
                    v-else
                    v-model="clientData.contact2"
                    label="Tél. Contacto 2 (212)xxx-xxxx"
                    :mask="mask"
                    color="dark"
                    type="tel"
                ></v-text-field>
                <span class="caption font-weight-light font-italic">* Los campos: Nombre, Cédula y Contacto 1, son requeridos para agregar un requerimiento.</span>               
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import firebase from 'firebase'
import Cleave from 'vue-cleave-component';
import { mapState, mapMutations } from 'vuex'

export default {
    components: {
        Cleave
    },
    data() {
        return {
            mask: 'phone',
            valid: false,
            edit: true,
            nameRules: [
                v => !!v || 'Nombre requerido',
            ],
            identifyRules: [
                v => v.length = 6 || 'Cédula requerido',
            ],
            contactRules: [
                v => v.length === 10 || 'Tél. contacto requerido'
            ]
        }
    },
    computed: {
        ...mapState(['clientData', 'optionsCleaveIdentify']),
        validIdentify: state => state.clientData.identify.length < 7 ? true : false
    },
    methods: {
        editUserData(){
            this.edit = false
        },
        saveUserData(){
            firebase.firestore()
                .collection('clientsRegisters')
                .doc(this.clientData.clientId)
                .set(this.clientData)
                .then(reponse => {
                    this.$alertify.success('Usuario actualizado con éxito.')
                })
            this.edit = true
        }
    }
}
</script>
