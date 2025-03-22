import { removeObjectRequest } from "./scene";
import { ref } from "vue";
import { selectedObjects, updateObjectRequest } from "./scene";
import { scene } from "./scene";
import { MenuItem } from "primevue/menuitem";

export const objectPropertiesDialog = ref<Set<string>>(new Set());

export const contextMenuItems = ref<MenuItem[]>([
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => {
      if (selectedObjects.value.size === 0) return;
      for (const object of selectedObjects.value) {
        const obj = scene.value.get(object);
        if (!obj) continue;
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
