import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../services/axios.js';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  state: {
    accessToken: localStorage.getItem("access_token"),
    currentUser: null
  },
  mutations: {
    setCurrentUser: (state, user) => state.currentUser = user,
    setAccessToken: (state, token) => state.accessToken = token,
    logout(state) {
      state.accessToken = null;
      state.currentUser = null;
    },
  },
  actions: {
    fetchCurrentUser: async ({ commit }) => {
      console.log('fetching current user');

      const { data: currentUser } = await axios.get("/users/self");
      commit("setCurrentUser", currentUser);
    },
    logout: ({ commit }) => {
      console.log('logging out');

      localStorage.removeItem("access_token");
      delete axios.defaults.headers.common["Authorization"];
      commit("logout");
    },
    fetchAccessToken: ({ commit }) => {
      console.log('fetching access token');

      const accessToken = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      commit("setAccessToken", accessToken);
    }
  },
  modules: {
  }
})