export const config = {
    port: process.env.PORT ?? 3000,
    jwtSecret: process.env.JWT_SECRET ?? 'secret',
    mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/impact',
};