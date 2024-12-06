<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style lang="css">
html {
  scroll-behavior: smooth;
}
body {
  background-color: #1c1b22;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;
  padding: 0px;
  min-height: calc(100vh - 20px);
  min-width: 820px;

  /** FONTS */
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
  color: var(--p-stone-200);
}
.p-dialog {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
  color: var(--p-stone-200);
  font-size: 24px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  font-weight: bold;
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
b,
i {
  margin: 0;
  padding: 0;
  font-size: 24px;
}
p {
  font-size: 24px;
  margin: 0;
  font-weight: normal;
}
ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: disc;
  padding-left: 0;
  margin: 0;
}
li {
  font-size: 24px;
  font-weight: normal;
}
a {
  text-decoration: none;
}
.text-contrast {
  color: var(--p-lime-200);
}
</style>
