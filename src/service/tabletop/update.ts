import { getStrokeBounds, selectedObject, tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType, TabletopStrokeObject, updateObjectsOnSceneNetwork } from ".";

export function onUpdate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    updateObjectsOnSceneNetwork();
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
            if (strokeObject.strokes.length > 1) {
            context.moveTo(strokeObject.strokes[0][0], strokeObject.strokes[0][1]);
                let max: [number, number] = [0, 0];
                let min: [number, number] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
                for (let j = 1; j < strokeObject.strokes.length; j++) {
                    context.lineTo(strokeObject.strokes[j][0], strokeObject.strokes[j][1]);
                    // get bounds
                    if (strokeObject.strokes[j][0] > max[0]) max[0] = strokeObject.strokes[j][0];
                    if (strokeObject.strokes[j][1] > max[1]) max[1] = strokeObject.strokes[j][1];
                    if (strokeObject.strokes[j][0] < min[0]) min[0] = strokeObject.strokes[j][0];
                    if (strokeObject.strokes[j][1] < min[1]) min[1] = strokeObject.strokes[j][1];
                }
                context.stroke();

                if (i === selectedObject.value) {
                    context.strokeStyle = '#58c9af';
                    context.lineWidth = 5;
                    context.strokeRect(
                        min[0],
                        min[1],
                        max[0] - min[0],
                        max[1] - min[1]
                    );
                }
            }
        }
        context.restore();
    }

    context.restore();
}