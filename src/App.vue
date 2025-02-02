<script setup lang="ts">
import { Toast, ConfirmDialog } from "primevue";
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast />
  <RouterView />
</template>

<style lang="css">
html {
  scroll-behavior: smooth;
}
body {
  background-color: #1c1b22;
  color: var(--p-stone-200);
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;
  padding: 0px;
  min-height: calc(100vh - 20px);
}

#app,
span,
div {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
}

/** HEADINGS */
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-weight: bold;
  scroll-margin-top: 200px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
}
h1 {
  font-size: 62px;
  color: var(--p-emerald-500);
}
h2 {
  font-size: 42px;
  color: var(--p-emerald-300);
}
h3 {
  font-size: 32px;
  color: var(--p-emerald-200);
}
h4 {
  font-size: 24px;
  color: var(--p-lime-200);
}
h5 {
  font-size: 20px;
}
h6 {
  font-size: 18px;
}

/** TEXT */
p,
li,
span,
a,
i,
b,
em {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;

  font-size: 24px;
  font-weight: normal;
  text-decoration: none;
  margin: 0;
  padding: 0;
}
b {
  font-weight: bold;
}
i,
em {
  font-style: italic;
}
.text-contrast {
  color: var(--p-lime-200);
}

.field {
  display: flex;
  flex-direction: column;
  overflow: none !important;
  margin-top: 20px;
  flex-grow: 1;
  gap: 5px;

  &.no-margin {
    margin-top: 0;
  }

  .field-label {
    color: var(--p-floatlabel-active-color);
    font-size: 12px;
    margin-left: 15px;
    font-weight: normal;
  }

  div.p-autocomplete,div.p-password,input {
    width: 100%;
  }
}
.p-tooltip {
  text-align: center;
}
</style>
