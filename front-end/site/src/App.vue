<template>

<NavBar></NavBar>

  <router-view />

  <loading
    style="
      margin: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999999999999999;
    "
    v-model:active="isLoading"
    :is-full-page="true"
    v-model:color="color"
  />
  <modal-alert />
  <modal-erro />
</template>

<script>
import { emitter } from "./services/global";

export default {
  name: 'App',
  data() {
    return {
      isLoading: false,
      color: "black",
    };
  },
  mounted: function () {
    emitter.on("loading", (mostrar) => {
      this.isLoading = mostrar;
    });
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
