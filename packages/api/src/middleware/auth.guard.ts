import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "src/services/jwt.service";

export type AuthRequest = Request & { user: { id: string } };

export class AuthGuard implements CanActivate {
    private readonly jwt: JwtService;

    constructor() {
        this.jwt = new JwtService();
    }

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedException();
        }
        
        const decoded = await this.jwt.verify(token);
        if (!decoded) {
            throw new UnauthorizedException();
        }
        request.user = decoded;
        return true;
    }
}