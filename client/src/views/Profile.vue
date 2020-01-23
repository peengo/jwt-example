<template>
  <div class="profile mt-5">
    <template v-if="user.username">
      <h3>user: {{ user.username }}</h3>
      <h6>Created: {{ user.created | formatDate }}</h6>
      <form ref="form" @submit.stop.prevent="submitUserUpdate" class="m-5">
        <b-form-group
          :state="validation.username.state"
          label="Change Username"
          label-for="username-input"
          :invalid-feedback="validation.username.message"
        >
          <b-form-input id="username-input" v-model="username" :state="validation.username.state"></b-form-input>
        </b-form-group>
        <b-form-group
          :state="validation.password.state"
          label="New Password"
          label-for="password-input"
          :invalid-feedback="validation.password.message"
        >
          <b-form-input id="password-input" v-model="password" :state="validation.password.state"></b-form-input>
        </b-form-group>

        <div class="text-center">
          <b-form-invalid-feedback :state="error.state">{{ error.message }}</b-form-invalid-feedback>
        </div>

        <div class="text-center py-3">
          <b-button block type="submit" variant="primary">Save</b-button>
        </div>

        <b-alert show dismissible v-model="isSaved" variant="success">Saved!</b-alert>
      </form>
    </template>
    <b-alert v-model="isError" variant="danger">{{ errorMessage }}</b-alert>
    <div>
      <b-button type="button" class="btn btn-danger" v-b-modal.modal-delete-user>Delete User Account</b-button>

      <b-modal
        id="modal-delete-user"
        centered
        cancel-title="Yes"
        ok-title="No"
        hide-header
        @cancel="submitUserDelete()"
      >
        <p class="my-4">Are you sure you want to delete your account?</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
    isError: false,
    errorMessage: "",
    isSaved: false,

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
  async created() {
    try {
      this.user = await this.getUserSelf();
      this.username = this.user.username;
    } catch (error) {
      if (error.response.data.error.message) {
        this.isError = true;
        this.error = error.response.data.error.message;
      }
    }
  },
  methods: {
    async submitUserUpdate() {
      try {
        const update = {
          username:
            this.username === this.user.username ? undefined : this.username,
          password: this.password || undefined
        };

        const response = await this.patchUser(this.user.username, update);
        this.user.username = this.username;
        await this.$store.dispatch("fetchCurrentUser");

        this.isSaved = true;

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    async submitUserDelete() {
      try {
        const response = await this.deleteUser(this.user.username);

        this.$store.dispatch("logout");

        if (this.$router.currentRoute.name !== "blog") {
          console.log("redirect");
          this.$router.push({ name: "blog" });
        }
        
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    async getUserSelf() {
      const { data } = await this.$http.get("/users/self");

      return data;
    },
    async patchUser(username, update) {
      const response = await this.$http.patch(`/users/${username}`, update);

      return response;
    },
    async deleteUser(username) {
      const response = await this.$http.delete(`/users/${username}`);

      return response;
    }
  }
};
</script>
