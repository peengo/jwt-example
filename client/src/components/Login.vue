<template>
  <b-tab title="Login" active>
    <form ref="form" @submit.stop.prevent="submitUserLogin" class="mt-5">
      <b-form-group
        :state="validation.username.state"
        label="Username"
        label-for="login-username-input"
        :invalid-feedback="validation.username.message"
      >
        <b-form-input
          id="login-username-input"
          v-model="username"
          :state="validation.username.state"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        :state="validation.password.state"
        label="Password"
        label-for="login-password-input"
        :invalid-feedback="validation.password.message"
      >
        <b-form-input
          id="login-password-input"
          type="password"
          v-model="password"
          :state="validation.password.state"
        ></b-form-input>
      </b-form-group>

      <div class="text-center">
        <b-form-invalid-feedback :state="error.state">{{ error.message }}</b-form-invalid-feedback>
      </div>

      <div class="text-center py-3">
        <b-button block type="submit" variant="primary">Login</b-button>
      </div>
    </form>
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
    }
  }),
  methods: {
    async submitUserLogin() {
      try {
        this.resetValidation();
        const response = await this.postUser();

        if (response.data.token) {
          this.$emit("modalToggle");

          const accessToken = response.data.token;
          localStorage.setItem("access_token", accessToken);

          await this.$store.dispatch("fetchAccessToken");
          await this.$store.dispatch("fetchCurrentUser");

          if (this.$router.currentRoute.name !== "blog") {
            console.log("redirect");
            this.$router.push({ name: "blog" });
          }
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
      const response = await this.$http.post("/auth", {
        username: this.username,
        password: this.password
      });

      return response;
    },
    async getUserSelf() {
      const { data } = await this.$http.get("/users/self");

      return data;
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