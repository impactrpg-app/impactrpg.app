import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";

export const contextMenuItems = ref<MenuItem[]>([
    {
        label: 'Delete Object',
        icon: 'pi pi-trash',
        command: () => {
            console.log('Delete Object');
        }
    }
]);

export function onMouseDown(event: MouseEvent) {

}

export function onMouseUp(event: MouseEvent) {

}

export function onMousemove(event: MouseEvent) {

}

export function onScroll(event: WheelEvent) {

}

export function onMouseOver(event: MouseEvent) {

}

export function onContextMenu(event: MouseEvent, contextMenuRef: any) {
    contextMenuRef.show(event);
}