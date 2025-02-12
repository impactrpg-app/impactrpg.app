export class TabletopTool {
    public name: string = '';
    public icon: string = '';

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