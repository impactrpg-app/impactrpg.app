<script lang="ts" setup>
import CustomResourceComponent from "./CustomResourceComponent.vue";
import { Dialog, Button } from "primevue";
import { ref } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "rollDice", amount: number): void;
}>();

const diceAmount = ref(1);
</script>

<template>
  <Dialog
    :modal="false"
    position="top"
    :visible="props.isOpen"
    @update:visible="emits('update:isOpen', $event)"
    style="width: 300px"
    header="Dice Tray"
  >
    <div class="gap20 column">
      <CustomResourceComponent
        v-model="diceAmount"
        style="height: 50px"
        :max="99"
        :min="1"
        :step="1"
      />
      <Button label="Roll Dice" @click="() => emits('rollDice', diceAmount)" />
    </div>
  </Dialog>
</template>

<style lang="css"></style>
