import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./views/HomePage.vue";
import GettingStarted from "./views/GettingStarted.vue";
import CharacterSheet from "./views/CharacterSheet.vue";
import Rules from "./views/Rules.vue";
import Adventures from "./views/Adventures.vue";
import Monsters from "./views/Monsters.vue";
import World from "./views/World.vue";
import JoinRoom from "./views/JoinRoom.vue";
import CreateRoom from "./views/CreateRoom.vue";

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
      path: "/adventures",
      name: "Adventures",
      component: Adventures,
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
      path: "/create-room",
      name: "Create Room",
      component: CreateRoom,
    },
    {
      path: "/join-room",
      name: "Join Room",
      component: JoinRoom,
    },
  ],
});
