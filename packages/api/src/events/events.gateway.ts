import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(80, {
    namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @SubscribeMessage('event')
    handleEvent(client: Socket, payload: any) {
        console.log(payload);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Client connected');
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected');
    }
}
