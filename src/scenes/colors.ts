import { Scene } from '../scene';
import { Frame } from '../frame';
import { Info } from '../info';
import { getContext } from '../context';
import { hslToRgb } from '../color';
import { createImageData } from '../image-data';
import { multiply, compose } from '../curve';
import { Utils } from '../utils';

const MAX_DISTANCE = 5000;
const QUARTER_TURN = Math.PI / 2;
const SATURATION = 0.8;
const LIGHTNESS = 0.8;

/**
 * 6th degree polynomial regression through control points (0, 0), (0.7, 1),
 * and (1, 0).
 * @see https://www.desmos.com/calculator/wdb45brrj8
 */
const curve = compose(multiply(MAX_DISTANCE), (x) => {
  const a = -Math.E + 1;
  const b = 0;
  const c = 0;
  const d = 0;
  const f = 0;
  const g = Math.E - 1;
  const h = 0;
  return (
    a * x ** 6 +
    b * x ** 5 +
    c * x ** 4 +
    d * x ** 3 +
    f * x ** 2 +
    g * x +
    h
  );
});

export default class ColorsScene extends Scene {
  private readonly imageDataWidth = this.width / 2;
  private readonly imageDataHeight = this.height / 2;
  private readonly bufferCanvas = this.utils.createCanvas(this.imageDataWidth, this.imageDataHeight);
  private readonly bufferCtx = getContext(this.bufferCanvas);
  private readonly imageData = createImageData(this.bufferCtx);

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number, utils: Utils) {
    super(canvas, ctx, width, height, utils);
    this.ctx.translate(this.imageDataWidth, this.imageDataHeight);
  }

  drawToBuffer (frame: Frame, _info: Info) {
    const { imageDataWidth, imageDataHeight, imageData, bufferCtx } = this;
    for (let x = 0; x < imageDataWidth; x++) {
      for (let y = 0; y < imageDataHeight; y++) {
        const distance = Math.sqrt(x ** 2 + y ** 2);
        const hue = (curve(frame.progress) % distance) / distance;
        const [r, g, b] = hslToRgb(hue, SATURATION, LIGHTNESS);
        const index = 4 * (y * imageDataHeight + x);
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 0xff;
      }
    }
    bufferCtx.putImageData(imageData, 0, 0);
  }

  draw (frame: Frame, info: Info) {
    this.drawToBuffer(frame, info);
    const { ctx, bufferCanvas } = this;
    ctx.rotate(QUARTER_TURN);
    ctx.drawImage(bufferCanvas, 0, 0);
    ctx.rotate(QUARTER_TURN);
    ctx.drawImage(bufferCanvas, 0, 0);
    ctx.rotate(QUARTER_TURN);
    ctx.drawImage(bufferCanvas, 0, 0);
    ctx.rotate(QUARTER_TURN);
    ctx.drawImage(bufferCanvas, 0, 0);
  }
}
