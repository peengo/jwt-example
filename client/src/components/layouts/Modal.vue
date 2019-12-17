<template>
  <b-modal id="modal" v-model="loginSignupModalShow" centered justify hide-header hide-footer>
    <b-tabs fill>
      <Login @modalToggle="loginSignupModalShow = !loginSignupModalShow" />
      <Signup @modalToggle="loginSignupModalShow = !loginSignupModalShow" />
    </b-tabs>
  </b-modal>
</template>

<script>
import Login from "../Login.vue";
import Signup from "../Signup.vue";

export default {
  components: {
    Login,
    Signup
  },
  data: () => ({
    loginSignupModalShow: false
  })
};
</script>