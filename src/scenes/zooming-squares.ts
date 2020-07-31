import { Scene } from '../scene';
import { Frame } from '../frame';
import { loop } from '../curve';

export default class XorBoxesScene extends Scene {
  private readonly LOOPS = 5;
  private readonly SQUARES = 8;
  private readonly MAX_SQUARE_SIZE = Math.min(this.width, this.height) / (this.SQUARES - 1);
  private readonly BLACK_COLOR = 'black';
  private readonly WHITE_COLOR = 'white';

  draw (frame: Frame) {
    const { ctx, width, height, LOOPS, SQUARES, MAX_SQUARE_SIZE, BLACK_COLOR, WHITE_COLOR } = this;
    const { progress } = frame;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    const p = loop(LOOPS)(progress);
    for (let i = 0; i < SQUARES; i++) {
      ctx.fillStyle = i % 2 ? BLACK_COLOR : WHITE_COLOR;
      const size = MAX_SQUARE_SIZE * (SQUARES - i - 1 + p * 2);
      ctx.beginPath();
      ctx.rect(size / -2, size / -2, size, size);
      ctx.closePath();
      ctx.fill();
    }
    if (p > 0.5) {
      const size = MAX_SQUARE_SIZE * (p * 2 - 1);
      ctx.beginPath();
      ctx.rect(size / -2, size / -2, size, size);
      ctx.closePath();
      ctx.fillStyle = WHITE_COLOR;
      ctx.fill();
    }
    ctx.restore();
  }
}
