<template>
    <v-container fill-height grid-list-lg>
        <v-layout align-center justify-center wrap>
            <v-flex xs12 class="text-right">
                <v-subheader>Atención diaria</v-subheader>
                <v-spacer></v-spacer>
                {{viewDate}}
                <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 md4>
                <menu-options/>
            </v-flex>
            <v-flex xs12 md8>
                <chart-face v-if="customerSupport"/>
                <chart-face-not v-else/>
            </v-flex>
            <v-flex xs12>
                <Face v-if="customerSupport"/>
                <face-not v-else/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment'
import menuOptions from "./menuOptions"
import Face from "./face"
import FaceNot from "./faceNot"
import ChartFace from "./chartFace"
import ChartFaceNot from "./chartFaceNot"
import { mapState } from 'vuex';
export default {
    data() {
        return {
            date: moment().format('LLLL'),
        }
    },
    components:{
        menuOptions,
        Face,
        FaceNot,
        ChartFace,
        ChartFaceNot
    },
    computed: {
        ...mapState(['customerSupport']),
        viewDate: state => state.date
    },
    methods:{
        updateTimer(){
            setInterval ( () => this.date = moment().format('LLLL'), 60000)
        }
    },
    created (){
        this.updateTimer()
    }
}
</script>

