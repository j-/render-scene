import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, loop, multiply } from '../curve';

export default class extends Scene {
  protected readonly SQUARES = 20;
  protected readonly SIZE = this.width / this.SQUARES;

  draw (frame: Frame) {
    const { ctx, SIZE, SQUARES } = this;
    const { progress } = frame;
    this.clear();
    ctx.save();
    for (let x = 0; x < SQUARES; x++) {
      for (let y = 0; y < SQUARES; y++) {
        ctx.beginPath();
        ctx.rect(x * SIZE, y * SIZE, SIZE, SIZE);
        ctx.closePath();
        const xx = (x - SQUARES / 2);
        const yy = (y - SQUARES / 2);
        const loops = xx * yy;
        const hue = compose(multiply(360), loop(loops))(progress);
        ctx.fillStyle = `hsl(${hue}, 80%, 80%)`;
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
