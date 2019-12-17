<template>
  <div class="user">
    <template v-if="user.username">
      <h1>{{ user.username }}</h1>
      <h2>created: {{ user.created }}</h2>
    </template>
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
      this.user = await this.getUserSelf();
    } catch (error) {
      if (error.response.data.error.message) {
        this.isError = true;
        this.error = error.response.data.error.message;
      }
    }
  },
  methods: {
    async getUserSelf() {
      const { data } = await this.$http.get("/users/self");

      return data;
    }
  }
};
</script>
