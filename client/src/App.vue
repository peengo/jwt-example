<template>
  <b-container id="app">
    <Header />
    <Modal /> <!-- Login / Signup -->

    <router-view></router-view>

    <!-- <div id="app">
      <div id="nav">
        <router-link to="/">Home</router-link>|
        <router-link to="/about">About</router-link>
      </div>
      <router-view />
    </div>-->
  </b-container>
</template>

<script>
import Header from "./components/layouts/Header.vue";
import Modal from "./components/layouts/Modal.vue";

export default {
  name: "app",
  components: {
    Header,
    Modal
  }
};
</script>

<style>
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
