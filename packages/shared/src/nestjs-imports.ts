import type { ApiProperty as ApiPropertyType } from "@nestjs/swagger";
import type {
  IsEmail as IsEmailType,
  IsString as IsStringType,
  MinLength as MinLengthType,
  IsNumber as IsNumberType,
  IsOptional as IsOptionalType,
  IsArray as IsArrayType,
  ValidateNested as ValidateNestedType,
  IsBoolean as IsBooleanType,
  IsEnum as IsEnumType,
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

let IsNumber = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsNumberType;

let IsOptional = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsOptionalType;

let IsArray = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsArrayType;

let ValidateNested = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof ValidateNestedType;

let IsBoolean = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsBooleanType;

let IsEnum = function (..._args: any[]): PropertyDecorator {
  return function (..._args: any[]) {};
} as typeof IsEnumType;

if (process.title === 'node') {
  ApiProperty = require("@nestjs/swagger").ApiProperty;
  IsEmail = require("class-validator").IsEmail;
  IsString = require("class-validator").IsString;
  MinLength = require("class-validator").MinLength;
  IsNumber = require("class-validator").IsNumber;
  IsOptional = require("class-validator").IsOptional;
  IsArray = require("class-validator").IsArray;
  IsBoolean = require("class-validator").IsBoolean;
  IsEnum = require("class-validator").IsEnum;
}

export { ApiProperty, IsEmail, IsString, MinLength, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean, IsEnum };
