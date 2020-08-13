import { Frame } from './frame';
import { Info } from './info';
import { Utils } from './utils';

export abstract class Scene {
  constructor (
    /**
     * Base canvas element.
     */
    protected readonly canvas: HTMLCanvasElement,
    /**
     * 2D canvas rendering context.
     */
    protected readonly ctx: CanvasRenderingContext2D,
    /**
     * Canvas width in pixels.
     */
    protected readonly width: number,
    /**
     * Canvas height in pixels.
     */
    protected readonly height: number,
    /**
     * Utilities which may differ between execution environments.
     */
    protected readonly utils: Utils,
  ) {}
  /**
   * Draw a single frame of this scene. Is given information on the current
   * frame and its position in time, as well as information on the entire
   * scene.
   */
  draw (_frame: Frame, _info: Info) {}
  /**
   * Clear the canvas from `0, 0` to `this.width, this.height`.
   */
  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

export type SceneConstructor = new (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number, utils: Utils) => Scene;

export type SceneConstructorParams = ConstructorParameters<SceneConstructor>
