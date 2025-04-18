<script setup lang="ts">
import { onMounted } from "vue";
import * as TabletopService from "../service/tabletop";

onMounted(() => {
  TabletopService.init();
});
</script>

<template></template>
