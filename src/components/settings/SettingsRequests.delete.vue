<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="hidden-sm-and-down">Actualizar</v-toolbar-title>
                    <v-divider
                    class=""
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialogAddRequest" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="success" dark class="mb-2" v-on="on" outline small @click="newRequest = ''">Agregar</v-btn>
                        <v-btn color="primary" dark class="mb-2" @click="saveChange" outline small>Guardar</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">Agregar requerimiento</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field 
                                v-model="newRequest" 
                                label="Nombre del requerimiento"
                                color="primary"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-alert
                                :value="true"
                                type="warning"
                                >
                                Tenga en cuenta que los requerimientos agregados no podrán ser editados ni eliminados.
                                </v-alert>
                            </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" outline small flat @click="close">Cancelar</v-btn>
                        <v-btn color="primary" outline small flat @click="save" :disabled="disabledNewRequest">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    class="elevation-1"
                    :items="requests"
                >
                    <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td v-for="(aplication, i) in props.item.aplications" :key="i">
                        <v-switch 
                        color="success"
                        v-model="requests[props.index].aplications[i]"
                        >
                        </v-switch>
                    </td>
                    <td>
                        <v-switch 
                        color="success"
                        v-model="requests[props.index].face"
                        >
                        </v-switch>
                    </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import firebase from 'firebase'
export default {
    data() {
        return {
            dialogAddRequest: false,
            newRequest: '',
            requests: [],
            headers: [
                {
                    text: 'Requerimientos',
                    sortable: false,
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Pre/CDMA',
                    sortable: false,
                    align: 'left',
                    value: 'aplications'
                },
                {
                    text: 'Pre/GSM',
                    sortable: false,
                    align: 'left',
                    value: 'aplications'
                },
                {
                    text: 'Cre/CDMA',
                    sortable: false,
                    align: 'left',
                    value: 'aplications'
                },
                {
                    text: 'Cre/GSM',
                    sortable: false,
                    align: 'left',
                    value: 'aplications'
                },
                {
                    text: 'At. presencial',
                    sortable: false,
                    align: 'left',
                    value: 'face'
                }
            ]
        }
    },
    mounted() {
        firebase.firestore().collection('optionsRequests')
            .onSnapshot( snapshot => {
                this.requests = []
                snapshot.forEach(request => {
                    this.requests.push(request.data())
                })
            })
    },
    methods: {
        saveChange(){
            for(let key in this.requests){
                firebase.firestore()
                .collection("optionsRequests")
                .doc(key)
                .set(this.requests[key])
            }
            this.$alertify.success("Cambios guardados")
        },
        save(){
            this.requests.push({
                name: this.newRequest,
                face: false,
                aplications: [false, false, false, false]
            })
            this.close()
            this.$alertify.success("Requerimiento agreado")
            setTimeout(()=>{
                this.$alertify.warning("Recuerde guardar los cambios")
            }, 3000)
        },
        close () {
            this.dialogAddRequest = false
        },
    },
    computed: {
        disabledNewRequest(){
            return (this.newRequest === '') ? true : false
        }
    },
}
</script>
