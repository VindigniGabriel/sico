<template>
    <div class="justify-center">
        <form @submit.prevent="searchClient">
            <v-select
            :items="nacionality"
            color="dark"
            v-model="selectNacionality"
            label="Seleccione nacionalidad"
            @change="changeNacionality"
            ></v-select>
            <cleave 
            :options="optionsCleaveIdentify" 
            class="form-control" 
            color="deep-orange lighten-1"
            v-model.number="clientData.identify"
            type="tel"
            >
            </cleave>
            <v-btn 
            type="submit"
            outline
            color="deep-orange lighten-1"
            block
            small
            :disabled="verifySearch"
            >
            Registrar 
            </v-btn>
        </form>
    </div>
</template>

<script>
import Cleave from 'vue-cleave-component';
import firebase from 'firebase'
import { mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            nacionality: [
                'Venezolana',
                'Extranjero'
            ],
            selectNacionality: 'Venezolana',
        }
    },
    components: {
        Cleave
    },
    methods: {
        ...mapMutations(['setClientData', 'setClientDataFirestore', 'setClientExists', 'setAddRequest']),
        changeNacionality(){
            this.setClientDataFirestore({
                clientId: '',
                name: null,
                contact1: '',
                contact2: '',
                identify: 'V'
            })
            this.optionsCleaveIdentify.prefix = this.selectNacionality.substr(0,1)
        },
        searchClient(){
            firebase.firestore()
                .collection('clientsRegisters')
                .where('identify', '==', this.clientData.identify)
                .get()
                .then(client => {
                    if(client.empty){
                        this.setClientExists(false)
                        console.log('Ciente No registrado')
                        this.$alertify.warning('El usuario No se encuentra registrado')
                        let id = firebase.firestore().collection("clientsRegisters").doc().id
                        this.setClientData({
                            clientId: id,
                            name: null,
                            contact1: '',
                            contact2: ''
                        })
                        this.$router.push(`/registerclient/${id}`)
                    }else{
                        this.setClientExists(true)
                        this.setAddRequest(true)
                        console.log('Cliente registrado')
                        this.$alertify.message('El usuario se encuentra registrado')
                        client.forEach(dataClient => {
                            this.setClientDataFirestore({
                                clientId: dataClient.data().clientId,
                                name: dataClient.data().name,
                                contact1: dataClient.data().contact1,
                                contact2: dataClient.data().contact2,
                                identify: dataClient.data().identify
                            })
                            this.$router.push(`/registerclient/${dataClient.id}`)
                        })
                    }
                })

        }
    },
    computed: {
        ...mapState(['optionsCleaveIdentify', 'clientData']),
        verifySearch: (state) => state.clientData.identify.length > 6 ? false : true
    },
    mounted(){
        this.setAddRequest(false)
        this.setClientDataFirestore({
                clientId: '',
                name: null,
                contact1: '',
                contact2: '',
                identify: 'V'
            })
    }
    
}
</script>