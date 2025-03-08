import { addObjectToScene, tabletopObjects, TabletopObjectType, TabletopStrokeObject } from "../scene";
import { TabletopTool } from "./base";

export class DrawTool extends TabletopTool {
    public name: string = 'Draw';
    public icon: string = 'pi pi-pencil';
    public drawingObjectId: string | null = null;
    public drawingObjectIndex: number = -1;

    public onMouseDown(_: MouseEvent): void {
        this.drawingObjectId = addObjectToScene(TabletopObjectType.Stroke);
        this.drawingObjectIndex = tabletopObjects.value.findIndex(obj => obj.id === this.drawingObjectId);
    }

    public onMouseUp(_: MouseEvent): void {
        this.drawingObjectId = null;
        this.drawingObjectIndex = -1;
    }

    public onMouseMove(event: MouseEvent): void {
        if (!this.drawingObjectId) return;
        if (this.drawingObjectIndex === -1) return;
        const strokeObject = tabletopObjects.value[this.drawingObjectIndex] as TabletopStrokeObject;
        if (!strokeObject) return;
        strokeObject.strokes.push([event.clientX, event.clientY]);
        tabletopObjects.value[this.drawingObjectIndex].isDirty = true;
    }
}
