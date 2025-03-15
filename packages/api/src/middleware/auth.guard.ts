import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "src/services/jwt";

export class AuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }

        const decoded = this.jwt.verify(token);
        if (!decoded) {
            throw new UnauthorizedException();
        }
        request.user = decoded;
        return true;
    }
}