<template>
    <div>
        <v-navigation-drawer
        v-model="drawer"
        clipped
        absolute
        overflow
        app
        floating
        temporary
        :mini-variant="mini"
        >
        <v-list>
            <v-list-tile
                v-for="item in itemsMenu"
                :key="item.text"
                @click="url(item.url)"
            >
                <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
            >
                <v-list-tile-action>
                    <v-switch
                        color="teal lighten-3"
                        v-model="changeDark"
                        small
                    ></v-switch>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{!changeDark ? 'Fondo Claro' : 'Fondo Oscuro'}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-action>
                <v-btn icon @click.stop="mini = !mini" v-if="!mini">
                    <v-icon>chevron_left</v-icon>
                </v-btn>
                <v-btn icon @click.stop="mini = !mini" v-else>
                    <v-icon>chevron_right</v-icon>
                </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed dark clipped-left color="primary">
            <v-toolbar-side-icon @click.stop="drawer = !drawer" v-show="statusSesion"></v-toolbar-side-icon>
            <v-toolbar-title>GerenciaPCG</v-toolbar-title>
            <v-spacer></v-spacer>
            {{userName}}
            <v-btn color="primary" icon @click="logout" v-show="statusSesion">
                <v-icon>power_settings_new</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import firebase from 'firebase'
export default {
    data() {
        return {
            changeDark: true,
            mini: true,
            drawer: null,
            itemsMenu: [
                { icon: 'person_add', text: 'Registro de usuarios', url: '/' },
                { icon: 'list', text: 'Historial de la OC', url: '/list' },
                { icon: 'calendar_today', text: 'Citas', url: '/quote' },
                { icon: 'settings', text: 'Configuraciones', url: '/settings' }
            ],
        }
    },
    computed: {
        ...mapState(['idOffice', 'statusSesion', 'userName', 'userEmail', 'setDark'])
    },
    methods: {
        ...mapMutations(['setIdOffice', 'setStatusSesion', 'setUserEmail', 'setUserName', 'setSetDark']),
        url(url){
            this.$router.push(`${url}`)
        },
        logout(){
            firebase.auth().signOut().then( success => {
                this.setIdOffice(null)
                this.setStatusSesion(false)
                this.setUserEmail(null)
                this.setUserName(null)
                console.log('Sesión cerrada')
            }).catch( error => {
                console.log('Error al cerrar Sesión')
            });
        }
    },
    watch: {
        changeDark(val){
            val || this.setSetDark(val)
            !val || this.setSetDark(val)
        }
    },
    created() {
        this.changeDark = this.setDark
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                firebase.firestore()
                    .collection('usersApp')
                    .doc(user.uid)
                    .get()
                    .then(data => {
                        this.setIdOffice(data.data().idOffice)
                        this.setStatusSesion(true)
                        this.setUserEmail(firebase.auth().currentUser.email)
                        this.setUserName(firebase.auth().currentUser.displayName)
                        console.log('Usuario Logeado')
                        this.$router.push('/')
                    })
            }else{
                console.log('No hay Usuario Logeado')
                this.$router.push('/Login')
            }
        })
    },
}
</script>