import { removeObjectRequest } from "./scene";
import { ref } from "vue";
import { selectedObjects, updateObjectRequest } from "./scene";
import { scene } from "./scene";
import { MenuItem } from "primevue/menuitem";

export const contextMenuItems = ref<MenuItem[]>([
    {
      label: 'Unlock Object',
      icon: 'pi pi-lock-open',
      visible: () => {
        if (selectedObjects.value.size === 0) return false;
        for (const object of selectedObjects.value) {
          const obj = scene.value.get(object);
          if (!obj) continue;
          return obj.locked;
        }
        return false;
      },
      command: () => {
        if (selectedObjects.value.size === 0) return;
        for (const object of selectedObjects.value) {
          const obj = scene.value.get(object);
          if (!obj) continue;
          obj.locked = false;
          updateObjectRequest(obj.uuid, {
            locked: obj.locked,
          });
        }
        selectedObjects.value.clear();
      },
    },
    {
      label: 'Lock Object',
      icon: 'pi pi-lock',
      visible: () => {
        if (selectedObjects.value.size === 0) return false;
        for (const object of selectedObjects.value) {
          const obj = scene.value.get(object);
          if (!obj) continue;
          return !obj.locked;
        }
        return false;
      },
      command: () => {
        if (selectedObjects.value.size === 0) return;
        for (const object of selectedObjects.value) {
          const obj = scene.value.get(object);
          if (!obj) continue;
          obj.locked = !obj.locked;
          updateObjectRequest(obj.uuid, {
            locked: obj.locked,
          });
        }
        selectedObjects.value.clear();
      },
    },
    {
      label: "Delete Object",
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
  ]);