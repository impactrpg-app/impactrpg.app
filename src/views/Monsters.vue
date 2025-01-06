<script setup lang="ts">
import { Button } from "primevue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Monster, monsters, MonsterType } from '../data/monsters';

const sortedMonsters = computed<Map<MonsterType, Monster[]>>(() => {
  return new Map([
    [
      MonsterType.Animal,
      monsters
        .filter(m => m.type === MonsterType.Animal)
        .sort((a, b) => a.name.localeCompare(b.name))
    ],
    [
      MonsterType.Normal,
      monsters
        .filter(m => m.type === MonsterType.Normal)
        .sort((a, b) => a.name.localeCompare(b.name))
    ],
    [
      MonsterType.Magic,
      monsters
        .filter(m => m.type === MonsterType.Magic)
        .sort((a, b) => a.name.localeCompare(b.name))
    ],
    [
      MonsterType.Rare,
      monsters
        .filter(m => m.type === MonsterType.Rare)
        .sort((a, b) => a.name.localeCompare(b.name))
    ]
  ])
});
const scroll = ref<number>(0);

function updateScroll() {
  scroll.value = document.scrollingElement?.scrollTop ?? 0;
}
function getRollText(rolls: number[]) {
  if (!rolls || rolls.length === 0) return '#';
  if (rolls.length === 1) {
    return rolls[0];
  }
  return `${rolls[0]}-${rolls[rolls.length - 1]}`
}

onMounted(() => {
  window.addEventListener("scroll", updateScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScroll);
});
</script>

<template>
  <div class="rules">
    <Button class="back-button" :as="scroll > 100 ? 'a' : 'router-link'"
      :icon="`pi pi-chevron-${scroll > 100 ? 'up' : 'left'}`" :href="scroll > 100 ? '#' : undefined"
      :to="scroll <= 100 ? '/' : undefined" />
    <h1>Monsters</h1>
    <div class="contents">
      <div class="section" v-for="monsterType in Object.values(MonsterType)">
        <a :href="`#${monsterType}`">
          <h6 class="heading">{{ monsterType }}</h6>
        </a>
        <a :href="`#${animal.name}`" v-for="animal in sortedMonsters.get(monsterType)">
          <h6>{{ animal.name }}</h6>
        </a>
      </div>
    </div>
    <template v-for="monsterType in Object.values(MonsterType)">
      <h1 :id="monsterType">{{ monsterType }}</h1>
      <div class="page">
        <div class="column" style="flex-direction: row; flex-wrap: wrap;">
          <div class="block" v-for="monster in sortedMonsters.get(monsterType)">
            <h2 :id="monster.name">{{ monster.name }}</h2>
            <p><b class="text-contrast">{{ monster.type }}</b></p>
            <p><i>{{ monster.description }}</i></p>
            <h3>STATS</h3>
            <p>
              <b class="text-contrast">Strength</b> {{ monster.abilities.strength }},
              <b class="text-contrast">Agility</b> {{ monster.abilities.agility }},
              <b class="text-contrast">Intelligence</b> {{ monster.abilities.intelligence }}
            </p>
            <p>
              <b class="text-contrast">Actions per Turn</b> {{ monster.actionsPerTurn }}
              <b class="text-contrast">Wounds</b> {{ monster.wounds }},
            </p>
            <h3>ACTIONS</h3>
            <ul>
              <li v-for="action in monster.actions">
                <b class="text-contrast">{{ getRollText(action.rolls) }}: {{ action.name }}</b>
                <br />
                {{ action.description }}
              </li>
            </ul>
            <template v-if="monster.specials">
              <h3>SPECIALS</h3>
              <p v-for="special in monster.specials">
                <b class="text-contrast">{{ special.name }}:</b> {{ special.description }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
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

.p-dialog {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
  color: var(--p-stone-200);
  font-size: 24px;
}

.back-button {
  position: fixed;
  top: 20px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: 0.3s;
}

.skill-examples {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 40px;
  max-height: 1500px;
  width: 820px;

  .skill-example {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 380px;
  }
}

.rules {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 200px;
  margin-bottom: 200px;

  h1 {
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .contents {
    display: flex;
    flex-direction: row;
    gap: 50px;
    width: 100%;
    margin-bottom: 50px;
    align-items: flex-start;
    justify-content: center;

    @media (max-width: 820px) {
      align-items: center;
      flex-direction: column;
    }

    .section {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-basis: 25%;
      gap: 20px;

      @media (max-width: 820px) {
        min-width: 175px;
      }

      .heading {
        color: var(--p-emerald-200);
      }

      h6 {
        color: var(--p-lime-200);
      }
    }
  }

  .page {
    display: flex;
    flex-direction: row;
    gap: 40px;
    width: 820px;

    @media (max-width: 820px) {
      width: 400px;
      flex-wrap: wrap;
    }

    .column {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 20px;
      min-width: 400px;

      @media (max-width: 820px) {
        height: auto !important;
      }

      .block {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 20px;
        max-width: 400px;
      }
    }
  }
}
</style>
