import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { config } from "src/config";

@Injectable()
export class JwtService {
    private readonly secretKey: string;

    constructor() {
        this.secretKey = config.jwtSecret;
    }

    async sign(payload: any) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    }

    async verify(token: string) {
        return jwt.verify(token, this.secretKey);
    }

    async decode(token: string) {
        return jwt.decode(token);
    }
}