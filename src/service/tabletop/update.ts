import { selectedObject, tabletopCamera, tabletopObjects } from ".";

export function onUpdate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    // translate to camera position
    context.translate(
        tabletopCamera.value.position[0],
        tabletopCamera.value.position[1]
    );
    context.scale(
        tabletopCamera.value.zoom,
        tabletopCamera.value.zoom
    );

    // draw objects
    for (let i = 0; i < tabletopObjects.value.length; i++) {
        const object = tabletopObjects.value[i];
        context.save();

        // translate to object position
        context.translate(
            object.position[0],
            object.position[1]
        );
        // rotate object
        context.rotate(object.rotation);
        // scale object
        context.scale(
            object.scale,
            object.scale
        );
        // draw object
        context.drawImage(object.image, 0, 0);

        if (i === selectedObject.value) {
            context.strokeStyle = '#58c9af';
            context.lineWidth = 5;
            context.strokeRect(
                0,
                0,
                object.image.width,
                object.image.height
            );
        }

        context.restore();
    }

    context.restore();
}