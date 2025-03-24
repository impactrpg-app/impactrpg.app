<script lang="ts" setup>
import CustomResourceComponent from "./CustomResourceComponent.vue";
import { Dialog, ToggleSwitch } from "primevue";
import { computed } from "vue";
import { objectPropertiesDialog } from "../service/tabletop/contextMenu";
import {
  scene,
  sortScene,
  updateObjectRequest,
} from "../service/tabletop/scene";

const objects = computed(() => objectPropertiesDialog.value);
const order = computed({
  get() {
    for (const object of objects.value) {
      const obj = scene.value.get(object);
      if (!obj) continue;
      return obj.order ?? 0;
    }
    return 0;
  },
  set(val: number) {
    for (const object of objects.value) {
      const obj = scene.value.get(object);
      if (!obj) continue;
      obj.order = val;
      sortScene();
      updateObjectRequest(object, {
        order: obj.order,
      });
    }
  },
});
const rotation = computed({
  get() {
    for (const object of objects.value) {
      const obj = scene.value.get(object);
      if (!obj) continue;
      return obj.rotation * (180 / Math.PI);
    }
    return 0;
  },
  set(val: number) {
    for (const object of objects.value) {
      updateObjectRequest(object, {
        rotation: val * (Math.PI / 180),
      });
    }
  },
});
const scale = computed({
  get() {
    for (const object of objects.value) {
      const obj = scene.value.get(object);
      if (!obj) continue;
      return obj.scale * 100;
    }
    return 1;
  },
  set(val: number) {
    for (const object of objects.value) {
      updateObjectRequest(object, {
        scale: val / 100,
      });
    }
  },
});
const lockObject = computed({
  get() {
    for (const object of objects.value) {
      const obj = scene.value.get(object);
      if (!obj) continue;
      return obj.locked;
    }
    return false;
  },
  set(val: boolean) {
    for (const object of objects.value) {
      updateObjectRequest(object, {
        locked: val,
      });
    }
  },
});

function onVisibleUpdate(visible: boolean) {
  if (visible) return;
  objectPropertiesDialog.value.clear();
}
</script>

<template>
  <Dialog
    :modal="false"
    :visible="objects.size > 0"
    @update:visible="onVisibleUpdate"
    header="Object Properties"
  >
    <div class="column gap20">
      <label>
        <span>Order</span>
        <CustomResourceComponent v-model="order" :min="-100" :max="100" />
      </label>
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
