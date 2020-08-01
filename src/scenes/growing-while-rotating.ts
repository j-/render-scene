import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, turn, loop, multiply } from '../curve';

export default class extends Scene {
  protected readonly SQUARES = 20;
  protected readonly SIZE = this.width / 10;
  protected readonly BLACK_COLOR = 'black';
  protected readonly WHITE_COLOR = 'white';

  draw (frame: Frame) {
    const { ctx, width, height, SIZE, SQUARES, BLACK_COLOR, WHITE_COLOR } = this;
    const { progress } = frame;
    this.clear();
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(SIZE, SIZE);
    ctx.globalCompositeOperation = 'xor';
    ctx.fillStyle = WHITE_COLOR;
    ctx.fillRect(-1, -1, 2, 2);
    let lastAngle = 0;
    for (let i = 0; i < SQUARES; i++) {
      ctx.rotate(-lastAngle);
      const angle = compose(turn, loop(i + 1), multiply(1 / 4), loop(3))(progress);
      const scale = Math.sin(angle - lastAngle) + Math.cos(angle - lastAngle);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.fillRect(-1, -1, 2, 2);
      lastAngle = angle;
    }
    ctx.restore();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = BLACK_COLOR;
    ctx.fillRect(0, 0, width, height);
  }
}
