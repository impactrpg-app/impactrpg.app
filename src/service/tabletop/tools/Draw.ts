import { TabletopTool } from "./base";

export class DrawTool extends TabletopTool {
    public name: string = 'Draw';
    public icon: string = 'pi pi-pencil';

    public onMouseDown(event: MouseEvent): void {
        console.log('onMouseDown', event);
    }

    public onMouseUp(event: MouseEvent): void {
        console.log('onMouseUp', event);
    }

    public onMouseMove(event: MouseEvent): void {
        console.log('onMouseMove', event);
    }
}
