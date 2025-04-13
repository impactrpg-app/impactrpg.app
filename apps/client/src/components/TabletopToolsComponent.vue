<script lang="ts" setup>
import * as TabletopService from "../service/tabletop";
import { Button, Divider, Dialog, InputNumber } from "primevue";
import { useDiceRoller } from "@/plugins/diceRoller";
import { getUserClaims } from "@/service/api";

const diceRoller = useDiceRoller();
const props = defineProps<{
  isCharactersOpen: boolean;
  isEncountersOpen: boolean;
  isRulebookOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "update:isCharactersOpen", value: boolean): void;
  (e: "update:isEncountersOpen", value: boolean): void;
  (e: "update:isRulebookOpen", value: boolean): void;
  (e: "uploadImage"): void;
  (e: "generateImage"): void;
}>();

async function rollDice() {
  const numberOfDice = diceRoller.getNumberOfDice();
  const result = await diceRoller.rollDice();
  const successes =
    result.filter((r) => r.value === 4 || r.value === 5).length +
    result.filter((r) => r.value === 6).length * 2;

  const claims = getUserClaims();
  if (!claims) {
    console.error("No user claims found");
    return;
  }
  const { displayName } = claims;
  TabletopService.sendNotificationRequest(
    `${displayName} Rolled ${numberOfDice} dice: ${result
      .map((r) => r.value)
      .join(", ")}. Successes: ${successes}`
  );
  setTimeout(() => {
    diceRoller.clear();
  }, 3000);
}
</script>

<template>
  <Dialog
    :modal="false"
    header="Roll Dice"
    :visible="diceRoller.getNumberOfDice() > 0"
    @update:visible="diceRoller.setNumberOfDice(0)"
  >
    <div class="column gap20">
      <InputNumber
        :min="0"
        :max="100"
        show-buttons
        button-layout="horizontal"
        :input-style="{ 'text-align': 'center' }"
        :model-value="diceRoller.getNumberOfDice()"
        @update:model-value="diceRoller.setNumberOfDice($event)"
      >
        <template #incrementicon>
          <span class="pi pi-plus" />
        </template>
        <template #decrementicon>
          <span class="pi pi-minus" />
        </template>
      </InputNumber>
      <Button
        label="Roll"
        class="w-full"
        :disabled="diceRoller.getNumberOfDice() <= 0"
        @click="rollDice"
      />
    </div>
  </Dialog>
  <div class="tools">
    <Button
      :variant="!props.isCharactersOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-user"
      v-tooltip.top="'Character Sheet'"
      @click="emits('update:isCharactersOpen', !props.isCharactersOpen)"
    />
    <Button
      :variant="diceRoller.getNumberOfDice() <= 0 ? 'outlined' : undefined"
      class="rounded-button"
      v-tooltip.top="'Roll Dice'"
      @click="diceRoller.setNumberOfDice(1)"
    >
      <template #icon>
        <span class="material-symbols-outlined">casino</span>
      </template>
    </Button>
    <Button
      :variant="!props.isEncountersOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-eye"
      v-tooltip.top="'Encounters'"
      @click="emits('update:isEncountersOpen', !props.isEncountersOpen)"
    />
    <Button
      :variant="!props.isRulebookOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-align-justify"
      v-tooltip.top="'Rulebook'"
      @click="emits('update:isRulebookOpen', !props.isRulebookOpen)"
    />
    <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-sign-out"
      v-tooltip.top="'Leave Room'"
      @click="TabletopService.leaveRoomRequest()"
    />
    <Divider layout="vertical" />
    <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-upload"
      v-tooltip.top="'Upload Image'"
      @click="emits('uploadImage')"
    />
    <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-search"
      v-tooltip.top="'Generate Image'"
      @click="emits('generateImage')"
    />
    <Divider layout="vertical" />
    <template v-for="tool in TabletopService.ALL_TOOLS">
      <Button
        :variant="
          TabletopService.tool.value.name !== tool.name ? 'outlined' : undefined
        "
        class="rounded-button"
        :icon="tool.icon"
        v-tooltip.top="tool.name"
        @click="TabletopService.tool.value = tool"
      />
    </template>
  </div>
</template>

<style lang="css" scoped>
.tools {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  z-index: 5000;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 50px;
  border: 0;

  .rounded-button {
    border-radius: 50%;
  }

  .search-input {
    border-radius: 20px;
    min-width: 400px;
  }
}
</style>
