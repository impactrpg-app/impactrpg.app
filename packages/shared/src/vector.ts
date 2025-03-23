export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  scale(scale: number): Vector2 {
    return new Vector2(this.x * scale, this.y * scale);
  }

  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  sub(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  rotate(angle: number): Vector2 {
    return new Vector2(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
  }

  negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
