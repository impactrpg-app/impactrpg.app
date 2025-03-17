// import { PayloadTypeEnum, sendMessage } from "../../room";
// import { TabletopObjectType } from "@impact/shared";
// import { tabletopMouse, tabletopObjects } from "../scene";
import { TabletopTool } from "./base";

export class DrawTool extends TabletopTool {
    public name: string = 'Draw';
    public icon: string = 'pi pi-pencil';
    public drawingObjectId: string | null = null;
    public drawingObjectIndex: number = -1;
    public drawingOrder: number = 0;
    public onMouseDown(_: MouseEvent): void {
        // todo: add object to scene
        // this.drawingObjectId = addObjectToScene(TabletopObjectType.Stroke);
        // this.drawingObjectIndex = tabletopObjects.value.findIndex(obj => obj.id === this.drawingObjectId);
    }

    public onMouseUp(_: MouseEvent): void {
        if (this.drawingObjectId) {
            // sendMessage({
            //     type: PayloadTypeEnum.AddTabletopChunkEnd,
            //     payload: { id: this.drawingObjectId }
            // });
        }
        this.drawingObjectId = null;
        this.drawingObjectIndex = -1;
        this.drawingOrder = 0;
    }

    public onMouseMove(_: MouseEvent): void {
        if (!this.drawingObjectId) return;
        if (this.drawingObjectIndex === -1) return;
        // todo: update the object by adding strokes
        // const strokeObject = tabletopObjects.value[this.drawingObjectIndex] as TabletopStrokeObject;
        // if (!strokeObject) return;
        // strokeObject.strokes.push(tabletopMouse.value.position);
        // tabletopObjects.value[this.drawingObjectIndex].isDirty = true;
    }
}
