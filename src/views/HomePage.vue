<script lang="ts" setup>
import PackageJson from "../../package.json";
import { Button, Divider } from "primevue";
</script>

<template>
  <div class="homepage">
    <h1>impact</h1>
    <div class="version">{{ PackageJson.version }}</div>
    <p>By Zeeshan Abid</p>
    <div class="spacer"></div>
    <p>A Free Tabletop Role Playing game.</p>
    <Button as="router-link" label="Getting Started" icon="pi pi-info" to="/getting-started" />
    <Button as="router-link" label="Character Sheet" icon="pi pi-user" to="/character-sheet" />
    <Button as="router-link" label="Encounters" icon="pi pi-users" to="/encounter" />
    <Button as="router-link" label="Rulebook" icon="pi pi-align-justify" to="/rules" />
    <Button as="router-link" label="Monsters" icon="pi pi-eye" to="/monsters" />
    <Button as="router-link" label="World" icon="pi pi-globe" to="/world" />
    <Button as="a" label="Donate" icon="pi pi-dollar" href="https://github.com/sponsors/zeeshan595" target="_blank" />
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
