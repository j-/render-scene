import { Scene } from '../../scene';
import { Frame } from '../../frame';
import { getContext } from '../../context';
import source from './source';

const lerp = (min: number, max: number, value: number) => (
  min + (max - min) * value
);

export default class extends Scene {
  protected readonly MIN_LINE_WIDTH = this.height / 400;
  protected readonly MAX_LINE_WIDTH = this.height / 40;
  protected readonly LINE_GAP = this.height / 30;
  protected readonly LINE_COUNT = this.height / this.LINE_GAP + 1;
  protected readonly LINE_STEPS = 50;

  protected readonly srcCanvas = this.utils.createCanvas(this.width, this.height);
  protected readonly srcCtx = getContext(this.srcCanvas);
  protected values = new Uint8ClampedArray(this.width * this.height * 4);

  async setup () {
    const { ctx, srcCtx, values, width, height } = this;
    ctx.translate(width / 2, height / 2);
    const image = await this.utils.loadImage(source);
    const IMAGE_WIDTH = image.width;
    const IMAGE_HEIGHT = image.height;
    const IMAGE_MIN = Math.min(IMAGE_WIDTH, IMAGE_HEIGHT);
    const sx = (IMAGE_WIDTH - IMAGE_MIN) / 2;
    const sy = (IMAGE_HEIGHT - IMAGE_MIN) / 2;
    const sw = IMAGE_MIN;
    const sh = IMAGE_MIN;
    const dx = 0;
    const dy = 0;
    const dw = width;
    const dh = height;
    srcCtx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    const { data } = srcCtx.getImageData(0, 0, width, height);
    for (let i = 0; i < data.length; i += 4) {
      values[i / 4] = (
        data[i + 0] +
        data[i + 1] +
        data[i + 2]
      ) / 3;
    }
  }

  draw (frame: Frame) {
    this.clear();
    const { ctx, width, height, LINE_COUNT, LINE_GAP } = this;
    ctx.fillStyle = '#000';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#fff';
    for (let i = 0; i < LINE_COUNT; i++) {
      const y = LINE_COUNT / -2 * LINE_GAP + i * LINE_GAP;
      this.drawLine(width / -2, y, width / 2, y, frame);
    }
  }

  drawLine (x0: number, y0: number, x1: number, y1: number, frame: Frame) {
    const { ctx, width, height, MIN_LINE_WIDTH, MAX_LINE_WIDTH, LINE_STEPS } = this;
    for (let j = 0; j < LINE_STEPS; j++) {
      const xx0 = x0 + j / LINE_STEPS * (x1 - x0);
      const yy0 = y0 + j / LINE_STEPS * (y1 - y0);
      const xx1 = x0 + (j + 1) / LINE_STEPS * (x1 - x0);
      const yy1 = y1 + (j + 1) / LINE_STEPS * (y1 - y0);
      const lineValue = this.getLineValue(
        xx0 + width / 2,
        yy0 + height / 2,
        xx1 + width / 2,
        yy1 + height / 2,
      );
      ctx.lineWidth = lerp(MIN_LINE_WIDTH, MAX_LINE_WIDTH, lerp(0, lineValue, frame.progress));
      ctx.beginPath();
      ctx.moveTo(xx0, yy0);
      ctx.lineTo(xx1, yy1);
      ctx.stroke();
    }
  }

  /** 0-1 */
  getValue (x: number, y: number) {
    const xx = Math.max(0, Math.min(Math.round(x), this.width));
    const yy = Math.max(0, Math.min(Math.round(y), this.height));
    return this.values[yy * this.width + xx] / 0xff;
  }

  /** 0-1 */
  getLineValue (x0: number, y0: number, x1: number, y1: number) {
    return (this.getValue(x0, y0) + this.getValue(x1, y1)) / 2;
  }
}
