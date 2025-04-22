<script lang="ts" setup>
import { computed } from "vue";
import { Button } from "primevue";
import { CharacterDto } from "@impact/shared";
import CustomRatingComponent from "../CustomRatingComponent.vue";
import CustomResourceComponent from "../CustomResourceComponent.vue";

const props = defineProps<{
  modelValue: CharacterDto;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", data: CharacterDto): void;
  (e: "rollDice", amount: number): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: CharacterDto) {
    emits("update:modelValue", val);
  },
});
</script>

<template>
  <div class="row gap20 w100" style="padding-right: 20px">
    <div class="column gap10">
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Strength Roll'"
          @click="() => emits('rollDice', value.abilities.strength)"
        >
          <span>Strength</span>
        </Button>
        <CustomRatingComponent
          material-icons
          icon="swords"
          :stars="6"
          v-model="value.abilities.strength"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Agility Roll'"
          @click="() => emits('rollDice', value.abilities.agility)"
        >
          <span>Agility</span>
        </Button>
        <CustomRatingComponent
          icon="pi-bolt"
          :stars="6"
          v-model="value.abilities.agility"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Intelligence Roll'"
          @click="() => emits('rollDice', value.abilities.intelligence)"
        >
          <span>Intelligence</span>
        </Button>
        <CustomRatingComponent
          material-icons
          icon="neurology"
          :stars="6"
          v-model="value.abilities.intelligence"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Train'"
          @click="() => emits('rollDice', 1)"
        >
          <span>Progression</span>
        </Button>
        <CustomRatingComponent
          icon="pi-sparkles"
          :stars="6"
          v-model="value.progression"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Defense Roll'"
          @click="
            () => emits('rollDice', value.armor + value.abilities.agility)
          "
        >
          <span>Armor</span>
        </Button>
        <CustomRatingComponent
          icon="pi-shield"
          :stars="6"
          v-model="value.armor"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Attack Roll'"
          @click="
            () => emits('rollDice', value.attack + value.abilities.strength)
          "
        >
          <span>Attack</span>
        </Button>
        <CustomRatingComponent
          material-icons
          icon="swords"
          :stars="6"
          v-model="value.attack"
        />
      </div>
    </div>
    <div class="column gap10" style="align-items: end">
      <div class="stat">
        <span>Endurance</span>
        <CustomResourceComponent
          v-model:model-value="value.resources.endurance"
          :min="0"
          :max="20"
        />
      </div>
      <div class="stat">
        <span>Wounds</span>
        <CustomResourceComponent
          v-model:model-value="value.resources.wounds"
          :min="0"
        />
      </div>
      <div class="stat">
        <Button
          variant="text"
          v-tooltip.top="'Mana Roll'"
          @click="() => emits('rollDice', value.abilities.intelligence)"
        >
          <span>Mana</span>
        </Button>
        <CustomResourceComponent
          v-model:model-value="value.resources.mana"
          :min="0"
        />
      </div>
      <div class="stat">
        <span>Corruption</span>
        <CustomResourceComponent
          v-model:model-value="value.resources.corruption"
          :min="0"
        />
      </div>
      <div class="stat">
        <span>Gold</span>
        <CustomResourceComponent
          v-model:model-value="value.resources.gold"
          :min="0"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.stat {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;

  button {
    justify-content: start;
    padding: 0;

    &:hover {
      background-color: transparent;
    }
  }

  span {
    width: 140px;
    text-align: left;
    font-size: 20px;
  }
}
</style>
