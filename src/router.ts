import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./views/HomePage.vue";
import CharacterSheet from "./views/CharacterSheet.vue";
import Rules from "./views/Rules.vue";
import Monsters from "./views/Monsters.vue";
import World from "./views/World.vue";
import EncountersList from "./views/EncountersList.vue";
import Login from "./views/Login.vue";
import Characters from "./views/Characters.vue";
import Encounter from "./views/Encounter.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "impact.app",
      component: Homepage,
    },
    {
      path: "/characters",
      name: "Characters",
      component: Characters
    },
    {
      path: "/character-sheet/:characterId",
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
      path: '/encounters',
      name: 'Encounters List',
      component: EncountersList
    },
    {
      path: '/encounter/:encounterId',
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
