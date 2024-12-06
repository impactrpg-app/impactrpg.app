<script lang="ts" setup>
import { Button } from "primevue";
</script>

<template>
  <div class="homepage">
    <h1>impact</h1>
    <p>By Zeeshan Abid</p>
    <Divider />
    <p>A Free Tabletop Role Playing game.</p>
    <Button
      as="router-link"
      label="Getting Started"
      icon="pi pi-info"
      to="/getting-started"
    />
    <Button
      as="router-link"
      label="Character Sheet"
      icon="pi pi-user"
      to="/character-sheet"
    />
    <Button
      as="router-link"
      label="How to Play"
      icon="pi pi-align-justify"
      to="/rules"
    />
    <Button
      as="router-link"
      label="Adventures"
      icon="pi pi-map"
      to="/adventures"
    />
    <Button as="router-link" label="Monsters" icon="pi pi-eye" to="/monsters" />
    <Button as="router-link" label="World" icon="pi pi-globe" to="/world" />
    <Button as="router-link" label="Donate" icon="pi pi-dollar" to="/donate" />
    <Divider />
    <Button
      as="router-link"
      label="Create a Room"
      icon="pi pi-user-plus"
      to="/create-room"
    />
    <Button
      as="router-link"
      label="Join a Room"
      icon="pi pi-sign-in"
      to="/join-room"
    />
  </div>
</template>

<style lang="css" scoped>
.homepage {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;

  a {
    text-decoration: none;
  }
}
</style>
