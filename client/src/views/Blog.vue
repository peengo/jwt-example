<template>
  <div class="blog">
    <h1 class="mt-5 mb-3">Blog</h1>
    <b-list-group>
      <b-list-group-item v-for="post in posts" v-bind:key="post._id">
        <router-link
          class="mr-2 text-success"
          :to=" {name: 'post', params: { slug: slugify(post.title, post._id) }}"
        >{{ post.title }}</router-link>
        <small class="float-right">{{ post.created | formatDateTime }}</small>
        <router-link
          class="text-secondary"
          v-if="post.user[0]"
          :to="{ name: 'user', params: { username: post.user[0].username }}"
        >@{{ post.user[0].username }}</router-link>
        <template v-else>[deleted user]</template>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { slugifyWithId } from "../utils/slugify";

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
    },
    slugify(string, id) {
      return slugifyWithId(string, id);
    }
  }
};
</script>
