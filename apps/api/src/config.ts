export const config = {
  port: parseInt(process.env.PORT ?? "3000"),
  webSocketPort: parseInt(process.env.WEBSOCKET_PORT ?? "3001"),
  jwtSecret: process.env.JWT_SECRET ?? "secret",
  host: process.env.HOST ?? "http://localhost",
  mongoUri:
    process.env.MONGO_URI ??
    "mongodb://admin:password@127.0.0.1:27017/?directConnection=true",
  enableSSL: process.env.ENABLE_SSL === "true",
  storage: {
    host: process.env.STORAGE_HOST ?? "",
    region: process.env.STORAGE_REGION ?? "eu-west-1",
    bucket: process.env.STORAGE_BUCKET ?? "",
    key: process.env.STORAGE_KEY ?? "",
    secret: process.env.STORAGE_SECRET ?? "",
  },
};
