<template>
  <div class="user mt-5">
    <div v-if="user.username">
      <h2>User: {{ user.username }}</h2>
      <h6>Created: {{ user.created | formatDate }}</h6>
      <b-alert v-model="isError" variant="danger">{{ error }}</b-alert>
    </div>
    <h2 class="mt-5">Blog Posts</h2>
    <b-list-group>
      <b-list-group-item v-for="post in posts" v-bind:key="post._id">
        <h3 class="d-inline-block mr-2">{{ post.title }}</h3>
        <small class="float-right">{{ post.created | formatDateTime }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
    posts: [],
    isError: false,
    error: ""
  }),
  async created() {
    try {
      const username = this.$route.params.username;
      this.user = await this.getUser(username);
      this.posts = await this.getPosts(username);
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
    },
    async getPosts(username) {
      const { data } = await this.$http.get(`/posts/user/${username}`);

      return data;
    }
  }
};
</script>
