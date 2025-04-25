import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./views/HomePage.vue";
import Login from "./views/Login.vue";
import Tabletop from "./views/Tabletop.vue";
import Register from "./views/Register.vue";
import { accessToken } from "./service/api";
import AutoJoinRoom from "./views/AutoJoinRoom.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "impact.app",
      component: Homepage,
      beforeEnter: (_to, _from, next) => {
        if (!accessToken.value) {
          next({ path: "/login" });
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: (_to, _from, next) => {
        if (accessToken.value) {
          next({ path: "/" });
        } else {
          next();
        }
      },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      beforeEnter: (_to, _from, next) => {
        if (accessToken.value) {
          next({ path: "/" });
        } else {
          next();
        }
      },
    },
    {
      path: "/tabletop",
      name: "Tabletop",
      component: Tabletop,
      beforeEnter: (_to, _from, next) => {
        if (!accessToken.value) {
          next({ path: "/login" });
        } else {
          next();
        }
      },
    },
    {
      path: "/join/:roomId",
      name: "JoinRoom",
      component: AutoJoinRoom,
    },
  ],
});
