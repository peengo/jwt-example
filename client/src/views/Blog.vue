<template>
  <div class="blog">
    <h1>Blog</h1>
    <b-list-group>
      <b-list-group-item v-for="post in posts" v-bind:key="post._id">
        {{ post.title }}
        <router-link :to="{ name: 'user', params: { username: post.username }}">{{ post.username }}</router-link>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: []
  }),
  async created() {
    try {
      this.posts = await this.getAllPosts();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async getAllPosts() {
      const { data } = await this.$http.get("/posts");

      return data;
    }
  }
};
</script>
