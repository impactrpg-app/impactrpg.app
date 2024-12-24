<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Dialog, InputNumber, Button } from 'primevue';
import DiceComponent from './DiceComponent.vue';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';

const props = defineProps<{
  isOpen?: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>();

const isOpen = computed({
  get() {
    return props.isOpen;
  },
  set(value: boolean) {
    emits('update:isOpen', value);
  }
});

const diceToRoll = ref<number>(0);
const diceResults = ref<number[]>([]);
const totalResult = ref<number>(0);

watch(diceToRoll, () => {
  if (diceToRoll.value > diceResults.value.length) {
    diceResults.value = [
      ...diceResults.value,
      ...new Array(diceToRoll.value - diceResults.value.length).fill(1)
    ];
  } else if (diceToRoll.value < diceResults.value.length) {
    diceResults.value = diceResults.value.slice(0, diceToRoll.value);
  }
})

function rollDice() {
  if (diceToRoll.value <= 0) return;
  totalResult.value = 0;

  for (let i = 0; i < diceResults.value.length; i++) {
    diceResults.value[i] = new DiceRoll('1d6').total
    if (diceResults.value[i] > 3) {
      totalResult.value += diceResults.value[i] === 6 ? 2 : 1;
    }
  }
}
function getDiceColor(result: number) {
  if (result < 4) {
    return 'var(--p-stone-200)';
  }
  if (result < 6) {
    return 'var(--p-emerald-200)';
  }
  return 'var(--p-lime-200)';
}
</script>

<template>
  <Dialog modal v-model:visible="isOpen" header="Dice Roller" position="top" style="width: 300px;">
    <div class="dialog-content">
      <div class="field no-margin">
        <label class="field-label">
          Dice to Roll
        </label>
        <InputNumber :min="0" show-buttons button-layout="horizontal" placeholder="0" v-model="diceToRoll" />
      </div>
      <Button @click="rollDice">Roll</Button>
      <h3 v-if="diceResults.length > 0" style="text-align: center;">Result: {{ totalResult }}</h3>
      <div class="dice-box">
        <template v-for="result in diceResults">
          <DiceComponent :show-number="result" :dice-color="getDiceColor(result)" />
        </template>
      </div>
    </div>
  </Dialog>
</template>

<style lang="css" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: 0.3s;
}

.field {
  display: flex;
  flex-direction: column;
  overflow: none !important;
  margin-top: 20px;
  flex-grow: 1;
  gap: 5px;

  &.no-margin {
    margin-top: 0;
  }

  .field-label {
    color: var(--p-floatlabel-active-color);
    font-size: 12px;
    margin-left: 15px;
    font-weight: normal;
  }

  input {
    font-size: 24px;
    width: 100%;
  }
}

.dice-box {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
}
</style>