import { Scene } from '../../scene';
import { Frame } from '../../frame';
import { compose, easeInSin } from '../../curve';

const { PI } = Math;
const TAU = PI * 2;

interface Point2D {
  x: number;
  y: number;
}

// @see https://stackoverflow.com/a/49099258

const lineIntersection = (m1: number, b1: number, m2: number, b2: number): Point2D => {
  if (m1 === m2) {
    throw new Error('Parallel slopes');
  }
  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;
  return { x, y };
}

const pStr = (point: Point2D) => `${point.x},${point.y} `;

const getPath = (
  center: Point2D,
  startRadius: number,
  spacePerLoop: number,
  startTheta: number,
  endTheta: number,
  thetaStep: number,
): string => {
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

  let path = 'M ' + pStr(newPoint);

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

    path += 'Q ' + pStr(controlPoint) + pStr(newPoint);
  }

  return path;
}

export default class extends Scene {
  private readonly ORIGIN: Point2D = { x: this.width / 2, y: this.height / 2 };
  private readonly LOOPS = 60;
  private readonly START_RADIUS = 0;
  private readonly SPACE_PER_LOOP = this.width / (2 * this.LOOPS);
  private readonly START_THETA = 0;
  private readonly END_THETA = this.LOOPS * TAU * Math.SQRT2;
  private readonly STEP_THETA  = Math.PI / 6;

  draw (frame: Frame) {
    const { ctx, width, height, ORIGIN, START_RADIUS, SPACE_PER_LOOP, START_THETA, END_THETA, STEP_THETA } = this;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    const p = compose(easeInSin)(frame.progress);
    const path = new Path2D(
      getPath(
        ORIGIN,
        START_RADIUS,
        SPACE_PER_LOOP,
        START_THETA,
        p * END_THETA,
        STEP_THETA,
      ),
    );
    ctx.stroke(path);
  }
}
