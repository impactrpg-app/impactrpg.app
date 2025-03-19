import { MouseType } from "../mouse";

export class TabletopTool {
    public name: string = 'Unknown Tool';
    public icon: string = 'pi pi-exclamation-triangle';
    public disableContextMenu: boolean = false;

    public onMouseDown(mouse: MouseType): void {
        console.log('onMouseDown', mouse);
    }

    public onMouseUp(mouse: MouseType): void {
        console.log('onMouseUp', mouse);
    }

    public onMouseMove(mouse: MouseType ): void {
        console.log('onMouseMove', mouse);
    }
}