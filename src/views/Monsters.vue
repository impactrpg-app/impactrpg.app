<script setup lang="ts">
import { monsters, MonsterType } from "../data/monsters";
import RulesComponent, { RulesContent } from "../components/RulesComponent.vue";
import MonsterComponent from "../components/MonsterComponent.vue";

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
</script>

<template>
  <RulesComponent show-contents title="Monsters" :data="data" />
</template>
