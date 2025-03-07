import {
    getImageSize,
    objectCollider,
    screenPositionToWorldPosition,
    tabletopCamera,
    TabletopImageObject,
    tabletopMouse,
    tabletopObjects,
    TabletopObjectType,
    selectedObject
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
        const mouseWorldPosition = screenPositionToWorldPosition(tabletopMouse.value.position);
        for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
            const object = tabletopObjects.value[i];
            if (object.type !== TabletopObjectType.Image) continue;
            if (object.locked) continue;
            const collision = objectCollider(
                mouseWorldPosition,
                object.position,
                getImageSize((object as TabletopImageObject).image),
                tabletopCamera.value.zoom
            );
            if (!collision) continue;
                return i;
        }
        return -1;
    }
}
