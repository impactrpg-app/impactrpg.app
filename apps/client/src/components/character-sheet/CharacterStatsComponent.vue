<script lang="ts" setup>
import { computed } from 'vue';
import { CharacterDto } from '@impact/shared';
import CustomRatingComponent from '../CustomRatingComponent.vue';
import CustomResourceComponent from '../CustomResourceComponent.vue';

const props = defineProps<{
  modelValue: CharacterDto
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', data: CharacterDto): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: CharacterDto) {
    emits('update:modelValue', val);
  }
});
</script>

<template>
  <div class="row gap20 w100">
    <div class="column gap10">
      <div class="stat">
        <span>Strength</span>
        <CustomRatingComponent material-icons icon="swords" :stars="6" v-model="value.abilities.strength" />
      </div>
      <div class="stat">
        <span>Agility</span>
        <CustomRatingComponent icon="pi-bolt" :stars="6" v-model="value.abilities.agility" />
      </div>
      <div class="stat">
        <span>Intelligence</span>
        <CustomRatingComponent material-icons icon="neurology" :stars="6" v-model="value.abilities.intelligence" />
      </div>
      <div class="stat">
        <span>Progression</span>
        <CustomRatingComponent icon="pi-sparkles" :stars="6" v-model="value.progression" />
      </div>
      <div class="stat">
        <span>Armor</span>
        <CustomRatingComponent icon="pi-shield" :stars="6" v-model="value.armor" />
      </div>
      <div class="stat">
        <span>Attack</span>
        <CustomRatingComponent material-icons icon="swords" :stars="6" v-model="value.attack" />
      </div>
    </div>
    <div class="column gap10" style="align-items: end;">
      <div class="stat">
        <span>Endurance</span>
        <CustomResourceComponent v-model:model-value="value.resources.endurance" :min="0" :max="20" />
      </div>
      <div class="stat">
        <span>Wounds</span>
        <CustomResourceComponent v-model:model-value="value.resources.wounds" :min="0" />
      </div>
      <div class="stat">
        <span>Mana</span>
        <CustomResourceComponent v-model:model-value="value.resources.mana" :min="0" />
      </div>
      <div class="stat">
        <span>Corruption</span>
        <CustomResourceComponent v-model:model-value="value.resources.corruption" :min="0" />
      </div>
      <div class="stat">
        <span>Gold</span>
        <CustomResourceComponent v-model:model-value="value.resources.gold" :min="0" />
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

    span {
      width: 140px;
    }
  }
</style>