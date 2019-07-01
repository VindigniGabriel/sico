<template>
  <v-app :dark="setDark">
    <NavBar/>
    <v-content>
        <transition name="gpcg">
          <router-view/>
        </transition>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar";
import { mapState } from 'vuex';
export default {
  name: 'App',
  data () {
    return {
      
    }
  },
  computed: {
    ...mapState(['setDark'])
  },
  components: {
    NavBar
  }
}
</script>

<style>
  * base */
  .gpcg {
    backface-visibility: hidden;
    z-index: 1;
  }

  /* moving */
  .gpcg-move {
    transition: all 600ms ease-in-out 50ms;
  }

  /* appearing */
  .gpcg-enter-active {
    transition: all 400ms ease-out;
  }

  /* disappearing */
  .gpcg-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  /* appear at / disappear to */
  .gpcg-enter,
  .gpcg-leave-to {
    opacity: 0;
  }
</style>
