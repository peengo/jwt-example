<template>
  <b-tab title="Sign Up">
    <form ref="form" @submit.stop.prevent="submitUserSignup" class="mt-5" v-if="!isUserCreated">
      <b-form-group
        :state="validation.username.state"
        label="Username"
        label-for="signup-username-input"
        :invalid-feedback="validation.username.message"
      >
        <b-form-input id="signup-username-input" v-model="username" :state="validation.username.state"></b-form-input>
      </b-form-group>
      <b-form-group
        :state="validation.password.state"
        label="Password"
        label-for="signup-password-input"
        :invalid-feedback="validation.password.message"
      >
        <b-form-input id="signup-password-input" type="password" v-model="password" :state="validation.password.state"></b-form-input>
      </b-form-group>

      <div class="text-center">
        <b-form-invalid-feedback :state="error.state">{{ error.message }}</b-form-invalid-feedback>
      </div>

      <div class="text-center py-3">
        <b-button block type="submit" variant="primary">Sign Up</b-button>
      </div>
    </form>
    <b-alert
      v-model="isUserCreated"
      variant="success"
      class="my-5"
    >User {{ createdUsername }} successfully created! Please Login.</b-alert>
  </b-tab>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    validation: {
      username: {
        message: "",
        state: null
      },
      password: {
        message: "",
        state: null
      }
    },
    error: {
      message: "",
      state: null
    },
    isUserCreated: false,
    createdUsername: ""
  }),
  methods: {
    async submitUserSignup() {
      try {
        this.resetValidation();
        const response = await this.postUser();

        if (response.status == 201) {
          this.createdUsername = response.data.username;
          this.isUserCreated = true;
        }
      } catch (error) {
        if (error.response.data.error.message) {
          const message = error.response.data.error.message;

          this.error.message = message;
          this.error.state = false;
        }

        if (error.response.data.error.validation) {
          const validation = error.response.data.error.validation;

          if (validation.username) {
            this.validation.username.message = validation.username;
            this.validation.username.state = false;
          } else {
            this.validation.username.message = "";
            this.validation.username.state = true;
          }

          if (validation.password) {
            this.validation.password.message = validation.password;
            this.validation.password.state = false;
          } else {
            this.validation.password.message = "";
            this.validation.password.state = true;
          }
        }
      }
    },
    async postUser() {
      const response = await this.$http.post("/users", {
        username: this.username,
        password: this.password
      });

      return response;
    },
    resetValidation() {
      this.validation.username.message = "";
      this.validation.username.state = null;

      this.validation.password.message = "";
      this.validation.password.state = null;

      this.error.message = "";
      this.error.state = null;
    }
  }
};
</script>