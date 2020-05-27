import { Scene } from '../scene';
import { Frame } from '../frame';
import { Info } from '../info';
import { hslToRgb } from '../color';
import { createImageData } from '../image-data';
import { Utils } from '../utils';

const SATURATION = 0.8;
const LIGHTNESS = 0.8;

export default class ColorsScene extends Scene {
  private readonly imageData = createImageData(this.ctx);

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number, utils: Utils) {
    super(canvas, ctx, width, height, utils);
    this.ctx.translate(this.width / 2, this.height / 2);
  }

  draw (frame: Frame, _info: Info) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let xx = x / 2.5 + 10000;
        let yy = y / 2.5 + 10000;
        const distance = Math.sqrt(xx ** 3 + yy ** 3) / this.width / 100000;
        const hue = (100000 + frame.progress / 5) % distance / distance;
        const [r, g, b] = hslToRgb(hue, SATURATION, LIGHTNESS);
        const index = 4 * (y * this.height + x);
        this.imageData.data[index + 0] = r;
        this.imageData.data[index + 1] = g;
        this.imageData.data[index + 2] = b;
        this.imageData.data[index + 3] = 0xff;
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
