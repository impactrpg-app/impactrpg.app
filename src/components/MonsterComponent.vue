<script lang="ts" setup>
import { Monster } from "../data/monsters";

const props = defineProps<{
  monster: Monster;
}>();

function getRollText(rolls: number[]) {
  if (!rolls || rolls.length === 0) return "#";
  if (rolls.length === 1) {
    return rolls[0];
  }
  return `${rolls[0]}-${rolls[rolls.length - 1]}`;
}
</script>

<template>
  <p>
    <b class="text-contrast">{{ props.monster.type }}</b>
  </p>
  <p>
    <i>{{ props.monster.description }}</i>
  </p>
  <h3>STATS</h3>
  <p>
    <b class="text-contrast">Strength</b> {{ props.monster.abilities.strength }},
    <b class="text-contrast">Agility</b> {{ props.monster.abilities.agility }},
    <b class="text-contrast">Intelligence</b> {{ props.monster.abilities.intelligence }}
  </p>
  <p>
    <b class="text-contrast">Armor</b> {{ props.monster.armor }},
    <b class="text-contrast">Wounds</b> {{ props.monster.wounds }}
  </p>
  <p><b class="text-contrast">Actions per Turn</b> {{ props.monster.actionsPerTurn }}</p>
  <h3>ACTIONS</h3>
  <ul>
    <li v-for="action in props.monster.actions">
      <b class="text-contrast">{{ getRollText(action.rolls) }}: {{ action.name }}</b>
      <br />
      {{ action.description }}
    </li>
  </ul>
  <template v-if="props.monster.specials">
    <h3>SPECIALS</h3>
    <p v-for="special in props.monster.specials">
      <b class="text-contrast">{{ special.name }}:</b> {{ special.description }}
    </p>
  </template>
</template>
