<template>
  <div class="user">
    <h1>{{ user.username }}</h1>
    <h3>Posts</h3>
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
      this.user = await this.getUser();
    } catch (error) {
      if (error.response.data.error.message) {
        this.isError = true;
        this.error = error.response.data.error.message;
      }
    }
  },
  methods: {
    async getUser() {
      const { data } = await this.$http.get(
        `/users/${this.$route.params.username}`
      );

      return data;
    }
  }
};
</script>
