import * as Three from "three";

export class Dirtyable {
  public isPhysicsDirty: boolean;
  public isRenderDirty: boolean;
  public isNetworkDirty: boolean;

  constructor() {
    this.isPhysicsDirty = true;
    this.isRenderDirty = true;
    this.isNetworkDirty = false;
  }

  setDirty(boolean = true) {
    this.isPhysicsDirty = boolean;
    this.isRenderDirty = boolean;
    this.isNetworkDirty = boolean;
  }
}

export class Vector3 extends Dirtyable {
  get x() {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
    this.setDirty();
  }
  get y() {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    this.setDirty();
  }
  get z() {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
    this.setDirty();
  }

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

  constructor(
    private _x: number,
    private _y: number,
    private _z: number
  ) {
    super();
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
  distanceTo(other: Vector3): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  normalize(): Vector3 {
    const length = this.length();
    if (length === 0) {
      return new Vector3(0, 0, 0);
    }
    return new Vector3(this.x / length, this.y / length, this.z / length);
  }
  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  cross(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
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
  static fromObject(value: { x: number; y: number; z: number }) {
    return new Vector3(value.x, value.y, value.z);
  }
}

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";
export class Vector4 extends Dirtyable {
  get x() {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
    this.setDirty();
  }
  get y() {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    this.setDirty();
  }
  get z() {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
    this.setDirty();
  }
  get w() {
    return this._w;
  }
  set w(value: number) {
    this._w = value;
    this.setDirty();
  }

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
  get a() {
    return this.w;
  }
  set a(value: number) {
    this.w = value;
  }

  constructor(
    private _x: number,
    private _y: number,
    private _z: number,
    private _w: number
  ) {
    super();
  }

  add(other: Vector4): Vector4 {
    return new Vector4(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w
    );
  }
  subtract(other: Vector4): Vector4 {
    return new Vector4(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w
    );
  }
  multiply(other: number): Vector4 {
    return new Vector4(
      this.x * other,
      this.y * other,
      this.z * other,
      this.w * other
    );
  }
  divide(other: number): Vector4 {
    return new Vector4(
      this.x / other,
      this.y / other,
      this.z / other,
      this.w / other
    );
  }
  length(): number {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z, w: this.w };
  }
  normalize(): Vector4 {
    const length = this.length();
    if (length === 0) {
      return new Vector4(0, 0, 0, 0);
    }
    return new Vector4(
      this.x / length,
      this.y / length,
      this.z / length,
      this.w / length
    );
  }
  toEuler(order: EulerOrder = "XYZ") {
    const q = new Three.Quaternion(this.x, this.y, this.z, this.w);
    const euler = new Three.Euler();
    euler.setFromQuaternion(q, order);
    return { x: euler.x, y: euler.y, z: euler.z };
  }
  toEulerAngles(order: EulerOrder = "XYZ") {
    let { x, y, z } = this.toEuler();
    x = (x * 180) / Math.PI;
    y = (y * 180) / Math.PI;
    z = (z * 180) / Math.PI;
    return { x, y, z, order };
  }

  static zero() {
    return new Vector4(0, 0, 0, 0);
  }
  static one() {
    return new Vector4(1, 1, 1, 1);
  }
  static fromObject(value: { x: number; y: number; z: number; w: number }) {
    return new Vector4(value.x, value.y, value.z, value.w);
  }
  static fromVector3(vector: Vector3, w: number) {
    return new Vector4(vector.x, vector.y, vector.z, w);
  }
  static fromEulerAngles(
    x: number,
    y: number,
    z: number,
    order: EulerOrder = "XYZ"
  ) {
    // Convert angles to radians
    x = (x * Math.PI) / 180;
    y = (y * Math.PI) / 180;
    z = (z * Math.PI) / 180;
    return Vector4.fromEulerEuler(x, y, z, order);
  }
  static fromEulerEuler(
    x: number,
    y: number,
    z: number,
    order: EulerOrder = "XYZ"
  ) {
    // Create a quaternion from the angles
    const q = new Three.Quaternion().setFromEuler(
      new Three.Euler(x, y, z, order)
    );
    return new Vector4(q.x, q.y, q.z, q.w);
  }
}
