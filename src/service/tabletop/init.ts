import { canvasRef, onMessageReceived, onResize } from ".";
import { messageReceiver, PayloadTypeEnum, sendMessage, getRoomId } from "../room";

export function init(canvas?: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error('Canvas is required');
    }
    canvasRef.value = canvas;
    onResize(new UIEvent('resize'));
    messageReceiver.add(onMessageReceived);
    if (getRoomId()) {
        sendMessage({ type: PayloadTypeEnum.RequestTabletopObjects });
    }
}