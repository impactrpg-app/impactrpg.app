<script lang="ts" setup>
import PackageJson from "../../package.json";
import { Button } from "primevue";

function signOut() {
  // supabaseClient.auth.signOut();
}
</script>

<template>
  <div class="homepage">
    <h1>impact</h1>
    <div class="version">{{ PackageJson.version }}</div>
    <p>By Zeeshan Abid</p>
    <div class="spacer"></div>
    <p>A Free Tabletop Role Playing game.</p>
    <Button as="router-link" label="Play" icon="pi pi-play" to="/tabletop" />
    <Button as="a" label="Donate" icon="pi pi-dollar" href="https://github.com/sponsors/zeeshan595" target="_blank" />
    <Button label="Sign Out" icon="pi pi-sign-out" @click="signOut" />
  </div>
</template>

<style lang="css" scoped>
.spacer {
  height: 50px;
}

.homepage {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;

  .version {
    display: block;
    position: relative;
    height: 0;
    top: -40px;
    left: 125px;
    color: var(--p-lime-200);
  }

  a {
    text-decoration: none;
  }
}
</style>
