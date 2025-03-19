import { removeObjectRequest } from "./scene";
import { ref } from "vue";
import { selectedObject, updateObjectRequest } from "./scene";
import { scene } from "./scene";
import { MenuItem } from "primevue/menuitem";

export const contextMenuItems = ref<MenuItem[]>([
    {
      label: 'Unlock Object',
      icon: 'pi pi-lock-open',
      visible: () => {
        if (selectedObject.value === null) return false;
        const object = scene.value.get(selectedObject.value);
        if (!object) return false;
        return object.locked;
      },
      command: () => {
        if (selectedObject.value === null) return;
        const object = scene.value.get(selectedObject.value);
        if (!object) return;
        object.locked = false;
        updateObjectRequest(object.uuid, {
          locked: object.locked,
        });
        selectedObject.value = null;
      },
    },
    {
      label: 'Lock Object',
      icon: 'pi pi-lock',
      visible: () => {
        if (selectedObject.value === null) return false;
        const object = scene.value.get(selectedObject.value);
        if (!object) return false;
        return !object.locked;
      },
      command: () => {
        if (selectedObject.value === null) return;
        const object = scene.value.get(selectedObject.value);
        if (!object) return;
        object.locked = !object.locked;
        updateObjectRequest(object.uuid, {
          locked: object.locked,
        });
        selectedObject.value = null;
      },
    },
    {
      label: "Delete Object",
      icon: "pi pi-trash",
      command: () => {
        if (selectedObject.value === null) return;
        const object = scene.value.get(selectedObject.value);
        if (!object) return;
        removeObjectRequest(object);
      },
    },
  ]);