import { Scene } from '../../scene';
import { Frame } from '../../frame';
import { getContext } from '../../context';
import { compose, easeInSin } from '../../curve';
import source from './source';

const { PI } = Math;
const TAU = PI * 2;

interface Point2D {
  x: number;
  y: number;
}

const lerp = (min: number, max: number, value: number) => (
  min + (max - min) * value
);

// @see https://stackoverflow.com/a/49099258

const lineIntersection = (m1: number, b1: number, m2: number, b2: number): Point2D => {
  if (m1 === m2) {
    throw new Error('Parallel slopes');
  }
  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;
  return { x, y };
}

export default class extends Scene {
  private readonly ORIGIN: Point2D = { x: this.width * 0.425, y: this.height * 0.390 };
  private readonly LOOPS = 50;
  private readonly START_RADIUS = 0;
  private readonly SPACE_PER_LOOP = this.width / (2 * this.LOOPS);
  private readonly START_THETA = PI;
  private readonly END_THETA = this.LOOPS * TAU * Math.SQRT2 * 1.2;
  private readonly STEP_THETA = Math.PI / 150;
  private readonly MIN_LINE_WIDTH = this.width / 800;
  private readonly MAX_LINE_WIDTH = this.MIN_LINE_WIDTH * 5;

  private readonly srcCanvas = this.utils.createCanvas(this.width, this.height);
  private readonly srcCtx = getContext(this.srcCanvas);
  private values = new Uint8ClampedArray(this.width * this.height * 4);

  async setup () {
    const { srcCtx, values, width, height } = this;
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

  getValue (x: number, y: number) {
    return this.values[y * this.width + x] / 0xff;
  }

  getLineValue (x0: number, y0: number, x1: number, y1: number) {
    return (this.getValue(x0, y0) + this.getValue(x1, y1)) / 2;
  }

  draw (frame: Frame) {
    const { ctx, width, height, ORIGIN, START_RADIUS, SPACE_PER_LOOP, START_THETA, END_THETA, STEP_THETA } = this;
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    const p = compose(
      easeInSin,
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
      }
    )(frame.progress);
    this.drawPath(
      ORIGIN,
      START_RADIUS,
      SPACE_PER_LOOP,
      START_THETA,
      p * END_THETA,
      STEP_THETA,
    );
  }

  drawPath (
    center: Point2D,
    startRadius: number,
    spacePerLoop: number,
    startTheta: number,
    endTheta: number,
    thetaStep: number,
  ) {
    const { ctx } = this;

    // Rename spiral parameters for the formula r = a + bθ
    const a = startRadius;  // start distance from center
    const b = spacePerLoop / PI / 2; // space between each loop

    // convert angles to radians
    let newTheta = startTheta;
    let oldTheta = newTheta;

    // radii
    let oldR: number;
    let newR = a + b * newTheta;

    // start and end points
    const oldPoint: Point2D = { x: NaN, y: NaN };
    const newPoint: Point2D = {
      x: center.x + newR * Math.cos(newTheta),
      y: center.y + newR * Math.sin(newTheta)
    };

    // slopes of tangents
    let oldSlope: number;
    let newSlope = (b * Math.sin(oldTheta) + (a + b * newTheta) * Math.cos(oldTheta)) /
                   (b * Math.cos(oldTheta) - (a + b * newTheta) * Math.sin(oldTheta));

    while (oldTheta < endTheta - thetaStep) {
      oldTheta = newTheta;
      newTheta += thetaStep;

      oldR = newR;
      newR = a + b * newTheta;

      oldPoint.x = newPoint.x;
      oldPoint.y = newPoint.y;
      newPoint.x = center.x + newR * Math.cos(newTheta);
      newPoint.y = center.y + newR * Math.sin(newTheta);

      // Slope calculation with the formula:
      // (b * sinΘ + (a + bΘ) * cosΘ) / (b * cosΘ - (a + bΘ) * sinΘ)
      const aPlusBTheta = a + b * newTheta;

      oldSlope = newSlope;
      newSlope = (b * Math.sin(newTheta) + aPlusBTheta * Math.cos(newTheta)) /
                  (b * Math.cos(newTheta) - aPlusBTheta * Math.sin(newTheta));

      const oldIntercept = -(oldSlope * oldR * Math.cos(oldTheta) - oldR * Math.sin(oldTheta));
      const newIntercept = -(newSlope * newR* Math.cos(newTheta) - newR * Math.sin(newTheta));

      const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

      // Offset the control point by the center offset.
      controlPoint.x += center.x;
      controlPoint.y += center.y;

      ctx.beginPath();
      ctx.moveTo(oldPoint.x, oldPoint.y);
      ctx.bezierCurveTo(oldPoint.x, oldPoint.y, controlPoint.x, controlPoint.y, newPoint.x, newPoint.y);
      ctx.lineWidth = lerp(
        this.MIN_LINE_WIDTH,
        this.MAX_LINE_WIDTH,
        this.getLineValue(
          Math.round(oldPoint.x),
          Math.round(oldPoint.y),
          Math.round(newPoint.x),
          Math.round(newPoint.y),
        ),
      );
      ctx.stroke();
    }
  }
}
