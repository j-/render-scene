import { Scene, SceneConstructorParams } from '../../scene';
import { Frame } from '../../frame';
import { getContext } from '../../context';
import { compose, range, easeInOut } from '../../curve';
import source from './source';
import { Boxes } from './types';
import { boxesToSpiral } from './boxes-to-spiral';
import { getPartialLinePoints } from './get-partial-line-points';
import { createImageData } from 'canvas';

const clamp = (val: number, min: number, max: number) => (
  Math.min(max, Math.max(min, val))
);

export default class extends Scene {
  protected readonly SQUARE_COUNT = 20;
  protected readonly SQUARE_SIZE = this.width / this.SQUARE_COUNT;
  protected readonly MIN_STEPS = 3;
  protected readonly MAX_STEPS = 10;
  protected readonly DELTA_STEPS = this.MAX_STEPS - this.MIN_STEPS;
  protected readonly SOURCE_SIZE = this.SQUARE_COUNT * 2;

  protected readonly srcCanvas = this.utils.createCanvas(this.SOURCE_SIZE, this.SOURCE_SIZE);
  protected readonly srcCtx = getContext(this.srcCanvas);

  protected srcID: Uint8ClampedArray = createImageData(this.SOURCE_SIZE, this.SOURCE_SIZE).data;

  constructor(...args: SceneConstructorParams) {
    super(...args);
    const { srcCtx, SOURCE_SIZE } = this;
    this.utils.loadImage(source).then((image) => {
      const IMAGE_WIDTH = image.width;
      const IMAGE_HEIGHT = image.height;
      const IMAGE_MIN = Math.min(IMAGE_WIDTH, IMAGE_HEIGHT);
      const sx = (IMAGE_WIDTH - IMAGE_MIN) / 2;
      const sy = (IMAGE_HEIGHT - IMAGE_MIN) / 2;
      const sw = IMAGE_MIN;
      const sh = IMAGE_MIN;
      const dx = 0;
      const dy = 0;
      const dw = SOURCE_SIZE;
      const dh = SOURCE_SIZE;
      srcCtx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      this.srcID = srcCtx.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE).data;
    });
  }

  draw (frame: Frame) {
    const { srcID, ctx, width, height, SQUARE_COUNT } = this;
    if (!srcID) return;
    ctx.lineWidth = width / 500;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < SQUARE_COUNT; y++) {
      for (let x = 0; x < SQUARE_COUNT; x++) {
        const i = Math.sqrt(((SQUARE_COUNT - 1) / 2 - x) ** 2 + ((SQUARE_COUNT - 1) / 2 - y) ** 2) / Math.sqrt(2 * SQUARE_COUNT ** 2);
        const p = compose(
          easeInOut,
          range(i / 2, i / 2 + 0.5),
          (x) => {
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
          },
        )(frame.progress);
        this.drawSquare(x, y, p);
      }
    }
  }

  drawSquare (x: number, y: number, p: number) {
    const { ctx, MIN_STEPS, DELTA_STEPS, SQUARE_SIZE } = this;
    ctx.save();
    ctx.beginPath();
    const ltl = this.getLightness(x * 2, y * 2);
    const ltr = this.getLightness(x * 2 + 1, y * 2);
    const lbl = this.getLightness(x * 2, y * 2 + 1);
    const lbr = this.getLightness(x * 2 + 1, y * 2 + 1);
    const ll = (ltl + lbl) / 2;
    const lr = (ltr + lbr) / 2;
    const lt = (ltl + ltr) / 2;
    const lb = (lbl + lbr) / 2;
    const lightness = (ltl + ltr + lbl + lbr) / 4;
    const biasX = clamp(ll / (ll + lr), 0.2, 0.8);
    const biasY = clamp(lt / (lt + lb), 0.2, 0.8);
    const maxBias = Math.max(Math.abs(0.5 - biasX), Math.abs(0.5 - biasY));
    const steps = (
      MIN_STEPS +
      (1 - (lightness / 0xff)) * DELTA_STEPS * (1 - (maxBias / 0.5))
    );
    ctx.translate(x * SQUARE_SIZE, y * SQUARE_SIZE);
    const boxes: Boxes = [];
    // +1 extra step here
    for (let step = 0; step < steps + 1; step++) {
      const p = step / steps;
      const size = (1 - p) * SQUARE_SIZE;
      boxes.push([
        p * biasX * SQUARE_SIZE,
        p * biasY * SQUARE_SIZE,
        size,
        size,
      ]);
    }
    const spiral = boxesToSpiral(boxes).reverse();
    const points = getPartialLinePoints(spiral, p);
    if (points.length > 3) {
      ctx.moveTo(points[2][0], points[2][1]);
      // -2 points at the end
      for (let i = 3; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
    }
    const h = clamp(p * 360, 0, 360);
    const s = p === 1 ? 0 : clamp((1 + (1 / (100 * (p - 1)))) * 100, 0, 100);
    const l = p === 1 ? 0 : clamp(50 - (1 - (1 + (1 / (50 * (p - 1))))) * 50, 0, 100);
    ctx.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;
    ctx.stroke();
    ctx.restore();
  }

  getLightness (x: number, y: number) {
    const { srcID, SOURCE_SIZE } = this;
    const index = (y * SOURCE_SIZE + x) * 4;
    return (
      srcID[index + 0] +
      srcID[index + 1] +
      srcID[index + 2]
    ) / 3;
  };
}
