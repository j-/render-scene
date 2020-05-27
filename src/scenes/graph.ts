import { Scene } from '../scene';
import { Frame } from '../frame';
import { Info } from '../info';
import { hslToRgb } from '../color';
import { createImageData } from '../image-data';
import { Utils } from '../utils';

const SATURATION = 1;
const LIGHTNESS = 0.7;
const TAU = Math.PI * 2;

export default class ColorsScene extends Scene {
  private readonly imageData = createImageData(this.ctx);

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number, utils: Utils) {
    super(canvas, ctx, width, height, utils);
    this.ctx.translate(this.width / 2, this.height / 2);
  }

  draw (frame: Frame, _info: Info) {
    const { width, height, imageData, ctx } = this;
    const { progress } = frame;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let xx = ((x / width + 0.5) + Math.sin(progress * TAU) * 0.25) % 1 * 0x100;
        let yy = ((y / height + 0.5) + Math.cos(progress * TAU) * 0.25) % 1 * 0x100;
        const hue = (Math.max(0, Math.min(1, (xx ^ yy) / 0x100)) + (progress)) % 1;
        const [r, g, b] = hslToRgb(hue, SATURATION, LIGHTNESS);
        const index = 4 * (y * height + x);
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 0xff;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
