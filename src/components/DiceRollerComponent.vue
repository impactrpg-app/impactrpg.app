<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Dialog, InputNumber, Button, ToggleSwitch, InputText } from 'primevue';
import { $dt } from '@primevue/themes';
// @ts-ignore dice-box does not support typescript
import DiceBox from "@3d-dice/dice-box";
import { getRoomId, PayloadTypeEnum, sendMessage, userId } from '../service/room';

let diceBox: any = null;
const announceRolls = ref<boolean>(true);
const author = ref<string>('');

const props = defineProps<{
  modal?: boolean;
  isOpen?: boolean;
  rollAuthor?: string;
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
const diceToRoll = ref<number>(2);
const successes = ref<number | null>(null);

function initDiceBox() {
  successes.value = null;
  return new Promise((resolve) => {
    setTimeout(() => {
    diceBox = new DiceBox({
      assetPath: '/assets/',
      theme: 'theme-rock',
      themeColor: $dt('stone.600').value,
      id: 'dice-canvas',
      container: '#dice-box-container',
      scale: 6,
      linearDamping: 0.3,
      spinForce: 2,
      throwForce: 15,
      restitution: 0.3,
      lightIntensity: 0.8,
    });
    diceBox.init().then(resolve);
    }, 0)
  });
}

watch(isOpen, (newValue) => {
  if (!newValue) return;
  initDiceBox();
});

function getRollAuthor() {
  if (author.value !== '') return author.value;
  if (props.rollAuthor && props.rollAuthor !== '') return props.rollAuthor;
  return 'Someone';
}

function announceRoll(numberOfDice: number, result: number) {
  if (getRoomId() === null) return;
  const rollAuthor = getRollAuthor();
  
  const canvas = document.getElementById('dice-canvas') as HTMLCanvasElement;
  if (canvas) {
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const base64String = btoa(bytes.reduce(
          (data, byte) => data + String.fromCharCode(byte), ''
      ));

      // send notification
      sendMessage({
        type: PayloadTypeEnum.DiceRoll,
        message: `${rollAuthor} Rolled ${numberOfDice} dice and got ${result} success.`,
        image: `data:image/png;base64,${base64String}`,
        author: userId.value
      });
    }, 'image/png');
  }
}

async function rollDice() {
  successes.value = null;
  const numberOfDice = diceToRoll.value;
  const audio = new Audio('/dice-roll.mp3');
  audio.play();
  if (diceBox === null)
    await initDiceBox();
  const result = await diceBox.roll(`${numberOfDice}d6`);
  let total = 0;
  for (const dice of result) {
    if (dice.value === 6) {
      total += 2;
    } else if (dice.value >= 4) {
      total ++;
    }
  }
  successes.value = total;

  if (announceRolls) {
    announceRoll(numberOfDice, total);
  }
}
</script>

<template>
  <Dialog :modal="props.modal" v-model:visible="isOpen" header="Dice Roller" position="top" style="width: 400px;">
    <div class="dialog-content">
      <div class="field no-margin column">
        <label class="field-label">
          Who is rolling?
        </label>
        <InputText v-model="author" :placeholder="props.rollAuthor" />
      </div>
      <div class="field no-margin row">
        <label class="field-label">
          Announce Rolls
        </label>
        <ToggleSwitch v-model="announceRolls" />
      </div>
      <div class="field no-margin">
        <label class="field-label">
          Dice to Roll
        </label>
        <InputNumber
          show-buttons
          button-layout="horizontal"
          placeholder="# of dice"
          v-model="diceToRoll"
          :min="0"
          class="input-number-align-text-center"
          >
          <template #incrementicon>
              <span class="pi pi-plus" />
          </template>
          <template #decrementicon>
              <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>
      <Button @click="rollDice">Roll</Button>
      <div id="dice-box-container">
        <div class="result">{{ successes }}</div>
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
  overflow: visible;

  .result {
    display: block;
    position: relative;
    height: 0;
    top: 50px;
    width: 100%;
    text-align: center;
    text-shadow: 3px 3px 5px var(--p-stone-800);
    font-size: 42px;
    z-index: 100;
  }
}
</style>
<style lang="css">
.p-dialog-content {
  overflow: visible !important;
}
.input-number-align-text-center {
  input {
    text-align: center;
  }
}
#dice-box-container {
  display: block;
  position: relative;
  width: 100%;
  height: 400px;
  background: var(--p-stone-500);
  border-radius: 20px;
  box-shadow: inset 10px 10px 20px var(--p-stone-700),
              inset -10px -10px 20px rgba(168, 162, 158, 0.5);

  #dice-canvas {
    display: block;
    position: relative;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>