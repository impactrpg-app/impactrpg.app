import { selectedObject, tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType, TabletopStrokeObject } from ".";

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

        if (object.type === TabletopObjectType.Image) {
            const imageObject = object as TabletopImageObject;
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
            context.drawImage(imageObject.image, 0, 0);

            if (i === selectedObject.value) {
                context.strokeStyle = '#58c9af';
                context.lineWidth = 5;
                context.strokeRect(
                    0,
                    0,
                    imageObject.image.width,
                    imageObject.image.height
                );
            }
        }
        else if (object.type === TabletopObjectType.Stroke) {
            const strokeObject = object as TabletopStrokeObject;
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
            // draw strokes
            context.strokeStyle = strokeObject.strokeColor;
            context.lineWidth = strokeObject.strokeWidth;
            context.beginPath();
            context.moveTo(strokeObject.strokes[0][0], strokeObject.strokes[0][1]);
            for (let j = 1; j < strokeObject.strokes.length; j++) {
                context.lineTo(strokeObject.strokes[j][0], strokeObject.strokes[j][1]);
            }
            context.stroke();
        }
        context.restore();
    }

    context.restore();
}