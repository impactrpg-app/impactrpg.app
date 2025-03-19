import { KeyboardType, MouseType } from "../input";

export class TabletopTool {
    public name: string = 'Unknown Tool';
    public icon: string = 'pi pi-exclamation-triangle';
    public disableContextMenu: boolean = false;

    public onMouseDown(mouse: MouseType): void {}

    public onMouseUp(mouse: MouseType): void {}

    public onMouseMove(mouse: MouseType ): void {}

    public onKeyDown(keyboard: KeyboardType): void {}

    public onKeyUp(keyboard: KeyboardType): void {}
}