import { removeObjectRequest } from "./scene";
import { ref } from "vue";
import { selectedObjects } from "./scene";
import { scene } from "./scene";
import { MenuItem } from "primevue/menuitem";

export const objectPropertiesDialog = ref<Set<string>>(new Set());
export const contextMenuRef = ref();
export const contextMenuItems = ref<MenuItem[]>([
  {
    label: "Delete",
    icon: "pi pi-trash",
    disabled: () => {
      for (const object of selectedObjects.value) {
        const obj = scene.value.get(object);
        if (!obj) continue;
        if (!obj.locked) return false;
      }
      return true;
    },
    command: () => {
      if (selectedObjects.value.size === 0) return;
      for (const object of selectedObjects.value) {
        const obj = scene.value.get(object);
        if (!obj) continue;
        if (obj.locked) continue;
        removeObjectRequest(obj);
      }
      selectedObjects.value.clear();
    },
  },
  {
    label: "Properties",
    icon: "pi pi-cog",
    command: () => {
      objectPropertiesDialog.value = new Set([...selectedObjects.value]);
    },
  },
]);
