<template>
  <b-nav align="right" class="mt-3">
    <b-nav-item :to="{ name: 'home'}">Home</b-nav-item>
    <b-nav-item :to="{ name: 'about'}">About</b-nav-item>
    <b-nav-item v-b-modal.modal>Login</b-nav-item>
  </b-nav>
</template>

<script>
export default {};
</script>