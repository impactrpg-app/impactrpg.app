<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as TabletopService from "../service/tabletop";
import TabletopToolsComponent from "../components/TabletopToolsComponent.vue";

const isReady = ref(false);
const isCharacterSheetOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);

function uploadImage() {}
function generateImage() {}

onMounted(async () => {
  await TabletopService.init();
  isReady.value = true;
});
</script>

<template>
  <TabletopToolsComponent
    :is-characters-open="isCharacterSheetOpen"
    :is-encounters-open="isEncountersOpen"
    :is-rulebook-open="isRulebookOpen"
    @update:isCharactersOpen="isCharacterSheetOpen = $event"
    @update:isEncountersOpen="isEncountersOpen = $event"
    @update:isRulebookOpen="isRulebookOpen = $event"
    @upload-image="uploadImage"
    @generate-image="generateImage"
    v-if="isReady"
  />
</template>
