import {
    tabletopCamera,
    tabletopMouse,
    tabletopObjects,
    selectedObject,
    getObjectAtPosition
} from "..";
import { TabletopTool } from "./base";
export class GrabTool extends TabletopTool {
    public name: string = 'Grab';
    public icon: string = 'pi pi-arrows-alt';

    public onMouseDown(_: MouseEvent): void {
        selectedObject.value = this.selectObject();
    }

    public onMouseUp(_: MouseEvent): void {
        selectedObject.value = -1;
    }

    public onMouseMove(_: MouseEvent): void {
        if (!tabletopMouse.value.pressed) return;

        if (selectedObject.value !== -1) {
            tabletopObjects.value[selectedObject.value].position[0] += tabletopMouse.value.delta[0];
            tabletopObjects.value[selectedObject.value].position[1] += tabletopMouse.value.delta[1];
            tabletopObjects.value[selectedObject.value].isDirty = true;
        }
        else {
            tabletopCamera.value.position[0] += tabletopMouse.value.delta[0];
            tabletopCamera.value.position[1] += tabletopMouse.value.delta[1];
        }
    }

    private selectObject(): number {
        return getObjectAtPosition(tabletopMouse.value.position);
    }
}
