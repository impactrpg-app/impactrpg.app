import { PayloadTypeEnum, sendMessage } from "../../room";
import { addObjectToScene, tabletopMouse, tabletopObjects, TabletopObjectType, TabletopStrokeObject } from "../scene";
import { TabletopTool } from "./base";

export class DrawTool extends TabletopTool {
    public name: string = 'Draw';
    public icon: string = 'pi pi-pencil';
    public drawingObjectId: string | null = null;
    public drawingObjectIndex: number = -1;
    public drawingOrder: number = 0;
    public onMouseDown(_: MouseEvent): void {
        this.drawingObjectId = addObjectToScene(TabletopObjectType.Stroke);
        this.drawingObjectIndex = tabletopObjects.value.findIndex(obj => obj.id === this.drawingObjectId);
    }

    public onMouseUp(_: MouseEvent): void {
        if (this.drawingObjectId) {
            sendMessage({
                type: PayloadTypeEnum.AddTabletopChunkEnd,
                payload: { id: this.drawingObjectId }
            });
        }
        this.drawingObjectId = null;
        this.drawingObjectIndex = -1;
        this.drawingOrder = 0;
    }

    public onMouseMove(_: MouseEvent): void {
        if (!this.drawingObjectId) return;
        if (this.drawingObjectIndex === -1) return;
        const strokeObject = tabletopObjects.value[this.drawingObjectIndex] as TabletopStrokeObject;
        if (!strokeObject) return;
        strokeObject.strokes.push(tabletopMouse.value.position);
        tabletopObjects.value[this.drawingObjectIndex].isDirty = true;

        if (this.drawingObjectId) {
            sendMessage({
                type: PayloadTypeEnum.AddTabletopChunk,
                payload: {
                    id: this.drawingObjectId,
                    chunk: tabletopMouse.value.position,
                    order: this.drawingOrder
                }
            });
            this.drawingOrder++;
        }
    }
}
