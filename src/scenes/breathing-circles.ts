import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, multiply, phase, sin, square } from '../curve';

const { PI } = Math;
const TAU = PI * 2;

export default class extends Scene {
  protected readonly NUM_RINGS = 50;
  protected readonly MIN_RADIUS = this.width / 50;
  protected readonly MAX_RADIUS = this.width / 40;
  protected readonly RADIUS_DELTA = this.width / 25;

  draw (frame: Frame) {
    const { ctx, width, height, NUM_RINGS, MIN_RADIUS, MAX_RADIUS, RADIUS_DELTA } = this;
    const { progress } = frame;
    this.clear();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    let distance = 0;
    for (let ring = 0; ring < NUM_RINGS; ring++) {
      const count = Math.floor(1 + ring * 4 + ring ** 1.1);
      const radius = compose(
        multiply(MIN_RADIUS + (1 - ring / NUM_RINGS) * (MAX_RADIUS - MIN_RADIUS)),
        square,
        sin,
        phase(ring / NUM_RINGS * - 4),
      )(progress);
      for (let circle = 0; circle < count; circle++) {
        const angle = circle / count * TAU;
        const x = Math.sin(angle) * distance;
        const y = Math.cos(angle) * distance;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, TAU);
      }
      distance += radius + RADIUS_DELTA * (1 - (ring / NUM_RINGS));
    }
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
}
