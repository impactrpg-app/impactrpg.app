import { ApiProperty, IsEmail, IsString, MinLength } from '../nestjs-imports';

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