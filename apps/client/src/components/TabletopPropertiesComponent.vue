<script lang="ts" setup>
import CustomResourceComponent from "./CustomResourceComponent.vue";
import * as TabletopService from "@/service/tabletop";
import { Button, Dialog, ToggleSwitch } from "primevue";
import { Vector3, Vector4 } from "@/service/tabletop/vector";
import { computed } from "vue";

const props = defineProps<{
  isOpen: boolean;
  selectedObjects: TabletopService.Entity[];
}>();
const emits = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

const rotation = computed({
  get() {
    return 0;
  },
  set(val: number) {},
});
const scale = computed({
  get() {
    for (const obj of props.selectedObjects) {
      return obj.scale.x * 100;
    }
    return 1;
  },
  set(val: number) {
    const adjusted = val / 100;
    for (const obj of props.selectedObjects) {
      obj.scale = new Vector3(adjusted, adjusted, adjusted);
    }
  },
});
const lockObject = computed({
  get() {
    for (const obj of props.selectedObjects) {
      return obj.isLocked;
    }
    return false;
  },
  set(value: boolean) {
    for (const obj of props.selectedObjects) {
      obj.isLocked = value;
    }
  },
});

function deleteSelectedObjects() {
  for (const obj of props.selectedObjects) {
    const net = obj.getModule<TabletopService.NetworkModule>("Module::Network");
    if (net) {
      net.despawn();
    } else {
      obj.destroy();
    }
  }
  emits("update:isOpen", false);
}
</script>

<template>
  <Dialog
    :modal="false"
    :visible="props.isOpen"
    header="Object Properties"
    position="right"
    @update:visible="(value) => emits('update:isOpen', value)"
  >
    <div class="column gap20">
      <label>
        <span>Rotation</span>
        <CustomResourceComponent v-model="rotation" :min="-360" :max="360" />
      </label>
      <label>
        <span>Scale</span>
        <CustomResourceComponent v-model="scale" :min="1" :max="1000" />
      </label>
      <label>
        <span>Lock Object</span>
        <ToggleSwitch v-model="lockObject" input-id="lock-object" />
      </label>
      <label>
        <Button
          label="Delete"
          icon="pi pi-trash"
          @click="deleteSelectedObjects"
          variant="danger"
        />
      </label>
    </div>
  </Dialog>
</template>

<style lang="css" scoped>
label {
  display: flex;
  gap: 20px;
  align-items: center;

  span {
    width: 150px;
  }
  input {
    text-align: center;
  }
}
</style>
