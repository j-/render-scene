import { Scene } from '../scene';
import { Frame } from '../frame';

const PI = Math.PI;
const TAU = PI * 2;

const lerp = (v0: number, v1: number, t: number) => (
  v0 + (v1 - v0) * t
);

export default class extends Scene {
  protected readonly PERSPECTIVE = this.width * 0.8;
  protected readonly GLOBE_RADIUS = this.width * 0.4;
  protected readonly MIN_RADIUS = this.width * 0.001;
  protected readonly MAX_RADIUS = this.width * 0.005;

  draw (frame: Frame) {
    const { ctx, width, height } = this;
    const { progress } = frame;
    this.clear();
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    for (let phi = PI; phi < TAU; phi += PI / 24) {
      for (let theta = 0; theta < TAU; theta += PI / 12) {
        const rotation = lerp(0, PI / 12, progress);
        this.drawPoint(phi, theta + rotation);
      }
    }
    ctx.fill();
    ctx.restore();
  }

  drawPoint (phi: number, theta: number) {
    const { ctx, width, GLOBE_RADIUS, PERSPECTIVE, MIN_RADIUS, MAX_RADIUS } = this;
    const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = GLOBE_RADIUS * Math.cos(phi);
    const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta) + GLOBE_RADIUS;
    const scaleProjected = PERSPECTIVE / (PERSPECTIVE + z);
    const xProjected = x * scaleProjected;
    const yProjected = y * scaleProjected;
    const radius = lerp(MIN_RADIUS, MAX_RADIUS, 1 - z / width);
    ctx.moveTo(xProjected, yProjected);
    ctx.arc(xProjected, yProjected, radius, 0, TAU);
  }
}
