import { Post, Body, Controller, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "@impact/shared";
import { hash, compare } from "bcrypt";
import { IsEmail, IsString, MinLength } from "class-validator";
import { JwtService } from "src/services/jwt.service";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @IsEmail()
    @ApiProperty({
        description: 'The email of the user',
        example: 'test@test.com'
    })
    email: string;

    @IsString()
    @MinLength(3)
    @ApiProperty({
        description: 'The password of the user',
        example: 'password'
    })
    password: string;
}

export class RegisterDto {
    @IsEmail()
    @ApiProperty({
        description: 'The email of the user',
        example: 'test@test.com'
    })
    email: string;

    @IsString()
    @MinLength(3)
    @ApiProperty({
        description: 'The password of the user',
        example: 'password'
    })
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'The access token of the user',
        example: 'token'
    })
    accessToken: string;
}

@Controller('auth')
export class AuthController {
    private readonly saltRounds = 10;

    constructor(
        @InjectModel(User.name) private readonly userService: Model<User>,
        private readonly jwtService: JwtService
    ) {}

    @ApiOperation({ summary: 'Login a user' })
    @ApiOkResponse({ type: LoginResponseDto })
    @Post('login')
    async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userService.findOne({
            email: body.email
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await compare(body.password, user.passwordHash);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.sign({
            id: user._id,
        });

        return { accessToken }
    }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiOkResponse({ type: LoginResponseDto })
    @Post('register')
    async register(@Body() body: RegisterDto): Promise<LoginResponseDto> {
        const existingUser = await this.userService.findOne({
            email: body.email
        });

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const user = await this.userService.create({
            email: body.email,
            passwordHash: await hash(body.password, this.saltRounds)
        });

        if (!user) {
            throw new BadRequestException('Failed to register user');
        }

        const accessToken = await this.jwtService.sign({
            id: user._id,
        });

        return {
            accessToken
        }
    }
}