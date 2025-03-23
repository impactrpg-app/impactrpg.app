import { KeyboardType, MouseType } from "../input";

export class TabletopTool {
    public name: string = 'Unknown Tool';
    public icon: string = 'pi pi-exclamation-triangle';

    public onMouseDown(_mouse: MouseType): void {}

    public onMouseUp(_mouse: MouseType): void {}

    public onMouseMove(_mouse: MouseType ): void {}

    public onKeyDown(_keyboard: KeyboardType): void {}

    public onKeyUp(_keyboard: KeyboardType): void {}
}