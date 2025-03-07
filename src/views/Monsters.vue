<script setup lang="ts">
import { monsters, MonsterType } from "../data/monsters";
import RulesComponent, { RulesContent } from "../components/RulesComponent.vue";
import MonsterComponent from "../components/MonsterComponent.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "primevue";
const data: RulesContent[] = Object.values(MonsterType).map((monsterType) => ({
  title: `${monsterType}s`,
  section: monsters
    .filter((m) => m.type === monsterType)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((monster) => ({
      title: monster.name,
      content: MonsterComponent,
      props: { monster },
    })),
}));

const scroll = ref<number>(0);
function updateScroll() {
  scroll.value = document.scrollingElement?.scrollTop ?? 0;
}
onMounted(() => {
  window.addEventListener("scroll", updateScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScroll);
});
</script>

<template>
  <Button
      class="back-button"
      :as="scroll > 100 ? 'a' : 'router-link'"
      :icon="`pi pi-chevron-${scroll > 100 ? 'up' : 'left'}`"
      :href="scroll > 100 ? '#' : undefined"
      :to="scroll <= 100 ? '/' : undefined"
    />
  <RulesComponent show-contents title="Monsters" :data="data" />
</template>

<style lang="css" scoped>
.back-button {
  position: fixed;
  top: 20px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: 0.3s;
}
</style>