import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, loop, phase, pulse } from '../curve';

const PI = Math.PI;
const TAU = 2 * PI;

export default class extends Scene {
  protected readonly SCALE = this.width / 20;
  protected readonly DELTA_X = this.SCALE * 2 * Math.cos(PI / 6);
  protected readonly DELTA_Y = this.SCALE;
  protected readonly MIN_DOT_SCALE = 0;
  protected readonly MAX_DOT_SCALE = 0.58;
  protected readonly DELTA_DOT_SCALE = this.MAX_DOT_SCALE - this.MIN_DOT_SCALE;

  draw (frame: Frame) {
    this.clear();
    const { ctx, width, height, SCALE, DELTA_X, DELTA_Y, MIN_DOT_SCALE, DELTA_DOT_SCALE } = this;
    const w = DELTA_X;
    const h = DELTA_Y;
    const countX = width / w * 2;
    const countY = height / h;
    ctx.beginPath();
    const offset = 3;
    const maxDistance = Math.sqrt((countX + offset) ** 2 + (countY + offset) ** 2) / 2;
    for (let gridY = -offset; gridY < countY + offset; gridY++) {
      for (let gridX = -offset; gridX < countX + offset; gridX++) {
        const odd = gridX % 2;
        const x = gridX * w / 2 + w / 2;
        const y = gridY * h - (odd ? (1 / 2) * h : 0);
        const distance = Math.sqrt(
          (x - (countX + offset) / 2) ** 2 +
          (y - (countY + offset) / 2) ** 2
        );
        const p = compose(
          pulse(1),
          loop(10),
          phase(distance / maxDistance),
        )(frame.progress);
        const scale = SCALE * (MIN_DOT_SCALE + p * DELTA_DOT_SCALE);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.moveTo(-1, 0);
        ctx.arc(0, 0, 1, 0, TAU);
        ctx.restore();
      }
    }
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}
