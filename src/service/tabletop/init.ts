import { canvasRef, onMessageReceived, onResize } from ".";
import { messageReceiver, PayloadTypeEnum, sendMessage } from "../room";

export function init(canvas?: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error('Canvas is required');
    }
    canvasRef.value = canvas;
    onResize(new UIEvent('resize'));
    messageReceiver.add(onMessageReceived);
    sendMessage({ type: PayloadTypeEnum.RequestTabletopObjects });
}