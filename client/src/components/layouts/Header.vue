<template>
  <b-nav align="right" class="mt-3">
    <b-nav-item :to="{ name: 'blog'}">Blog</b-nav-item>
    <b-nav-item v-b-modal.modal v-if="!currentUser">Login / Sign Up</b-nav-item>
    <b-nav-item-dropdown v-else>
      <template v-slot:button-content>{{ currentUser.username }}</template>
      <b-dropdown-item :to="{ name: 'profile'}">Profile</b-dropdown-item>
      <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
    </b-nav-item-dropdown>
  </b-nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["currentUser"]),
  created() {
    if (this.$store.state.accessToken) this.$store.dispatch("fetchCurrentUser");
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      if (this.$router.currentRoute.name !== "blog") {
        console.log("redirect");
        this.$router.push({ name: "blog" });
      }
    }
  }
};
</script>