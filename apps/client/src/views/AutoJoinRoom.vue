<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
localStorage.setItem("autoJoin", route.params.roomId as string);
window.location.href = `/tabletop`;
</script>

<template>
  <h4>Joinning Room {{ route.params.roomId }}</h4>
</template>
