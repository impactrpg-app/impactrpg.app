import { IsNumber } from "class-validator";

export class Vector3 {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
  @IsNumber()
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
export class Vector4 {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
  @IsNumber()
  z: number;
  @IsNumber()
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}
