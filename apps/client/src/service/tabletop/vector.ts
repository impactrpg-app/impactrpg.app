export class Vector3 {
  x: number;
  y: number;
  z: number;

  get r() {
    return this.x;
  }
  set r(value: number) {
    this.x = value;
  }
  get g() {
    return this.y;
  }
  set g(value: number) {
    this.y = value;
  }
  get b() {
    return this.z;
  }
  set b(value: number) {
    this.z = value;
  }

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  multiply(other: number): Vector3 {
    return new Vector3(this.x * other, this.y * other, this.z * other);
  }

  divide(other: number): Vector3 {
    return new Vector3(this.x / other, this.y / other, this.z / other);
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }
  static half() {
    return new Vector3(0.5, 0.5, 0.5);
  }
  static one() {
    return new Vector3(1, 1, 1);
  }
  static fromAngles(x: number, y: number, z: number) {
    const converter = Math.PI / 180;
    return new Vector3(x * converter, y * converter, z * converter);
  }
}
