<template>
  <div class="user">
    <h1>{{ user.username }}</h1>
    <h3>{{ user.created }}</h3>
    <b-alert v-model="isError" variant="danger">{{ error }}</b-alert>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
    isError: false,
    error: ""
  }),
  async created() {
    try {
      const username = this.$route.params.username;
      this.user = await this.getUser(username);
    } catch (error) {
      if (error.response.data.error.message) {
        this.isError = true;
        this.error = error.response.data.error.message;
      }
    }
  },
  methods: {
    async getUser(username) {
      const { data } = await this.$http.get(`/users/${username}`);

      return data;
    }
  }
};
</script>
