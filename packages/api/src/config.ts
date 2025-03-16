export const config = {
    port: parseInt(process.env.PORT ?? '3000'),
    webSocketPort: parseInt(process.env.WEBSOCKET_PORT ?? '3001'),
    jwtSecret: process.env.JWT_SECRET ?? 'secret',
    mongoUri: process.env.MONGO_URI ?? 'mongodb://admin:password@127.0.0.1:27017/?directConnection=true',
    enableSSL: process.env.ENABLE_SSL === 'true'
};