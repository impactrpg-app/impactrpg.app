import { ApiProperty, IsEmail, IsString, MinLength } from "../nestjs-imports";

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: "The email of the user",
    example: "test@test.com",
  })
  email: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  password: string;
}

export class RegisterDto {
  @IsString()
  @ApiProperty({
    description: "The display name of the user",
    example: "John Doe",
  })
  displayName: string;

  @IsEmail()
  @ApiProperty({
    description: "The email of the user",
    example: "test@test.com",
  })
  email: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: "The access token of the user",
    example: "token",
  })
  accessToken: string;
}
