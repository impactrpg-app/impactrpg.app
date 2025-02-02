import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./views/HomePage.vue";
import GettingStarted from "./views/GettingStarted.vue";
import CharacterSheet from "./views/CharacterSheet.vue";
import Rules from "./views/Rules.vue";
import Monsters from "./views/Monsters.vue";
import World from "./views/World.vue";
import Encounter from "./views/Encounter.vue";
import Login from "./views/Login.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "impact.app",
      component: Homepage,
    },
    {
      path: "/getting-started",
      name: "getting started",
      component: GettingStarted,
    },
    {
      path: "/character-sheet",
      name: "character sheet",
      component: CharacterSheet,
    },
    {
      path: "/rules",
      name: "Rules",
      component: Rules,
    },
    {
      path: "/monsters",
      name: "Monsters",
      component: Monsters,
    },
    {
      path: "/world",
      name: "World",
      component: World,
    },
    {
      path: '/encounter',
      name: 'Encounter',
      component: Encounter
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
});
