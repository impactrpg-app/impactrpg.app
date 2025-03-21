import type { ApiProperty as ApiPropertyType } from "@nestjs/swagger";
import type {
  IsEmail as IsEmailType,
  IsString as IsStringType,
  MinLength as MinLengthType,
} from "class-validator";

let ApiProperty = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof ApiPropertyType;

let IsEmail = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsEmailType;

let IsString = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsStringType;

let MinLength = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof MinLengthType;

if (process.title === 'node') {
  ApiProperty = require("@nestjs/swagger").ApiProperty;
  IsEmail = require("class-validator").IsEmail;
  IsString = require("class-validator").IsString;
  MinLength = require("class-validator").MinLength;
}

export { ApiProperty, IsEmail, IsString, MinLength };
