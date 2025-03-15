import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { config } from 'src/config';

@WebSocketGateway(config.webSocketPort, {
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
