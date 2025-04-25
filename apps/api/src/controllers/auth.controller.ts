import {
  Post,
  Body,
  Controller,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/db/user";
import { hash, compare } from "bcryptjs";
import { JwtService } from "src/services/jwt.service";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { LoginResponseDto, RegisterDto, LoginDto } from "@impact/shared";

@Controller("auth")
export class AuthController {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(User.name) private readonly userService: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  private sinUserAccessToken(
    user: User & { _id: Types.ObjectId }
  ): Promise<string> {
    return this.jwtService.sign({
      id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
    });
  }

  @ApiOperation({ summary: "Login a user" })
  @ApiOkResponse({ type: LoginResponseDto })
  @Post("login")
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findOne({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await compare(body.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.sinUserAccessToken(user);

    return { accessToken };
  }

  @ApiOperation({ summary: "Register a new user" })
  @ApiOkResponse({ type: LoginResponseDto })
  @Post("register")
  async register(@Body() body: RegisterDto): Promise<LoginResponseDto> {
    const existingUser = await this.userService.findOne({
      email: body.email,
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const user = await this.userService.create({
      displayName: body.displayName,
      email: body.email,
      passwordHash: await hash(body.password, this.saltRounds),
    });

    if (!user) {
      throw new BadRequestException("Failed to register user");
    }

    const accessToken = await this.sinUserAccessToken(user);

    return {
      accessToken,
    };
  }
}
