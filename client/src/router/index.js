import Vue from 'vue'
import VueRouter from 'vue-router'
import Blog from '../views/Blog.vue'
import User from '../views/User.vue'
import Profile from '../views/Profile.vue'
import Post from '../views/Post.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'blog',
    component: Blog
  },
  {
    path: '/user/:username',
    name: 'user',
    component: User
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post/:slug',
    name: 'post',
    component: Post
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.accessToken) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
