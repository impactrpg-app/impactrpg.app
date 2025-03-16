import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { config } from 'src/config';
import { JwtService } from 'src/services/jwt.service';

@WebSocketGateway(config.webSocketPort, {
    transports: ['websocket']
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private clients: Map<string, string> = new Map();

    constructor(private readonly jwtService: JwtService) {}

    @SubscribeMessage('event')
    handleEvent(client: Socket, payload: any) {
        console.log(payload);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const auth = client.handshake.auth['Authorization'];
        if (!auth) {
            client.disconnect();
            return;
        }
        const token = auth.split(' ')[1];
        try {
            const decoded = await this.jwtService.verify(token);
            if (!decoded || !decoded['id']) {
                client.disconnect();
                return;
            }
            this.clients.set(client.id, decoded['id']);
        } catch (error) {
            client.disconnect();
            return;
        }
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }
}
