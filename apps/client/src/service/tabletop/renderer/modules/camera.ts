import { Module } from "@/service/tabletop/scene";
import { Vector3 } from "@/service/tabletop/vector";
import * as Three from "three";
import { threeScene } from "../scene";
import { renderer } from "../renderer";

export enum CameraType {
  Perspective = "perspective",
  Orthographic = "orthographic",
}

export type PerspectivePropertiesType = {
  fov: number;
  aspectRatio: number;
  nearClipPlane: number;
  farClipPlane: number;
  autoUpdateAspectRatio: boolean;
};

export type OrthographicPropertiesType = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
};

export const CAMERA_MODULE = "Module::Camera";
export class CameraModule extends Module<Three.Camera> {
  private _perspectiveProperties: PerspectivePropertiesType = {
    fov: 70,
    aspectRatio: window.innerWidth / window.innerHeight,
    nearClipPlane: 0.1,
    farClipPlane: 100,
    autoUpdateAspectRatio: true,
  };
  private _orthographicProperties: OrthographicPropertiesType = {
    left: -10,
    right: 10,
    top: 10,
    bottom: -10,
    near: 0.1,
    far: 100,
  };

  constructor(private _cameraType: CameraType) {
    super();
  }

  get perspectiveProperties() {
    return this._perspectiveProperties;
  }
  set perspectiveProperties(value: PerspectivePropertiesType) {
    this._perspectiveProperties = value;
    if (this._cameraType === CameraType.Perspective) {
      const camera = this.data as Three.PerspectiveCamera;
      camera.fov = value.fov;
      camera.aspect = value.aspectRatio;
      camera.near = value.nearClipPlane;
      camera.far = value.farClipPlane;
      camera.updateProjectionMatrix();
    }
  }

  get orthographicProperties() {
    return this._orthographicProperties;
  }
  set orthographicProperties(value: OrthographicPropertiesType) {
    this._orthographicProperties = value;
    if (this._cameraType === CameraType.Orthographic) {
      const camera = this.data as Three.OrthographicCamera;
      camera.left = value.left;
      camera.right = value.right;
      camera.top = value.top;
      camera.bottom = value.bottom;
      camera.near = value.near;
      camera.far = value.far;
      camera.updateProjectionMatrix();
    }
  }
  get cameraType() {
    return this._cameraType;
  }
  set cameraType(value: CameraType) {
    this._cameraType = value;
    if (this._cameraType === CameraType.Perspective) {
      this.data = this.createPerspectiveCamera();
    } else if (this._cameraType === CameraType.Orthographic) {
      this.data = this.createOrthographicCamera();
    }
  }

  private onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (this._perspectiveProperties.autoUpdateAspectRatio) {
      this._perspectiveProperties.aspectRatio =
        window.innerWidth / window.innerHeight;

      if (this._cameraType === CameraType.Perspective) {
        const camera = this.data as Three.PerspectiveCamera;
        camera.aspect = this._perspectiveProperties.aspectRatio;
        camera.updateMatrix();
      }
    }
  }

  private createPerspectiveCamera() {
    return new Three.PerspectiveCamera(
      this._perspectiveProperties.fov,
      this._perspectiveProperties.aspectRatio,
      this._perspectiveProperties.nearClipPlane,
      this._perspectiveProperties.farClipPlane
    );
  }

  private createOrthographicCamera() {
    return new Three.OrthographicCamera(
      this._orthographicProperties.left,
      this._orthographicProperties.right,
      this._orthographicProperties.top,
      this._orthographicProperties.bottom,
      this._orthographicProperties.near,
      this._orthographicProperties.far
    );
  }

  async init() {
    this.type = CAMERA_MODULE;
    window.addEventListener("resize", () => this.onResize());
    switch (this._cameraType) {
      case CameraType.Perspective:
        this.data = this.createPerspectiveCamera();
        break;
      case CameraType.Orthographic:
        this.data = this.createOrthographicCamera();
        break;
    }
  }

  async destroy() {
    window.removeEventListener("resize", () => this.onResize());
    threeScene.remove(this.data);
  }

  getRayFromScreenPoint(x: number, y: number) {
    const raycaster = new Three.Raycaster();
    raycaster.setFromCamera(new Three.Vector2(x, y), this.data);
    const direction = new Vector3(
      raycaster.ray.direction.x,
      raycaster.ray.direction.y,
      raycaster.ray.direction.z
    );
    const origin = new Vector3(
      raycaster.ray.origin.x,
      raycaster.ray.origin.y,
      raycaster.ray.origin.z
    );
    return {
      origin,
      direction,
    };
  }

  update(): void {
    this.data.position.set(
      this.entity.position.x,
      this.entity.position.y,
      this.entity.position.z
    );
    this.data.setRotationFromEuler(
      new Three.Euler(
        this.entity.rotation.x,
        this.entity.rotation.y,
        this.entity.rotation.z
      )
    );
    renderer.render(threeScene, this.data);
  }
}
