import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./views/HomePage.vue";
import Login from "./views/Login.vue";
import Tabletop from "./views/Tabletop.vue";
import Register from "./views/Register.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "impact.app",
      component: Homepage,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/tabletop',
      name: 'Tabletop',
      component: Tabletop
    }
  ],
});
