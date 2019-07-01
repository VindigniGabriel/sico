<template>
    <div class="text-xs-center">
        <v-dialog
        v-model="dialogLoading"
        hide-overlay
        persistent
        width="300"
        >
            <v-card
                color="primary"
                dark
            >
                <v-card-text>
                    Procesando... favor espere
                    <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(['dialogLoading'])
    }
}
</script>
