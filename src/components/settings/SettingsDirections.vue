<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="hidden-sm-and-down primary--text" >Actualizar Direcciones Comerciales</v-toolbar-title>
                    <v-divider
                    class=""
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on" outline small @click="nameOcm = '', $refs.form.reset()">Agregar</v-btn>
                    </template>
                    <v-card>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-card-title>
                                <span class="headline">Agregar Dirección Comercial</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                    <v-flex xs12>
                                        <p>Dir. Comercial</p>
                                        <cleave 
                                        :options="optionsCleaveDir" 
                                        class="form-control" 
                                        color="primary"
                                        v-model="name"
                                        type="text"
                                        >
                                        </cleave>   
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                            label="Titular/ Encargado"
                                            color="primary"
                                            required
                                            v-model="holder"
                                            :rules="holderRules"
                                        ></v-text-field> 
                                    </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red" outline small flat @click="close">Cancelar</v-btn>
                                <v-btn color="primary" outline small flat @click="save" :disabled="disabledAdd || !valid">Guardar</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    class="elevation-1"
                    :items="items"
                >
                    <template v-slot:items="props">
                    <td class="text-center">{{ props.item.name }}</td>
                    <td class="text-center">{{ props.item.holder }}</td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Cleave from 'vue-cleave-component'
import firebase from 'firebase'
import { mapState } from 'vuex'
export default {
    components: {
        Cleave
    },
    data() {
        return {
            name: '',
            holder: '',
            data: '',
            dialog: false,
            items: [],
            headers: [
                {
                    text: 'Nombre de la Dir. Comercial',
                    align: 'center',
                    value: 'name'
                },
                {
                    text: 'Titular/ Encargado',
                    align: 'center',
                    value: 'holder'
                }
            ],
            valid: false,
            holderRules: [
                v => !!v || 'Nombre requerido',
            ],
        }
    },
    mounted() {
        firebase.firestore().collection('directionsCommercial')
            .onSnapshot( snapshot => {
                this.items = []
                snapshot.forEach(request => {
                    this.items.push(request.data())
                })
            })
    },
    methods: {
        save(){
            firebase.firestore()
                .collection("directionsCommercial")
                .where("name", "==", this.name)
                .get()
                .then(snapshot => {
                    if(snapshot.empty){
                          var id = firebase.firestore().collection("directionsCommercial").doc()
                            this.data = {
                                name: this.name,
                                holder: this.holder
                            }
                            firebase.firestore()
                                .collection("directionsCommercial")
                                .doc(id.id)
                                .set(this.data)
                        this.$alertify.success("Se ha agregado una Dirección Comercial")
                    }else{
                        this.$alertify.error("El nombre de la Dirección Comercial ya existe")
                    }
                })
            this.close()
        },
        close () {
            this.dialog = false
        },
    },
    computed: {
        disabledAdd: state => state.name.length < 9 ? true : false,
        ...mapState(['optionsCleaveDir']),
    },
}
</script>
