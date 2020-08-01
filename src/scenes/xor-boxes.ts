import { Scene } from '../scene';
import { Frame } from '../frame';
import { easeInOut, range, compose, loop } from '../curve';

const topLeft     = compose(easeInOut, range(0.0, 0.2));
const topRight    = compose(easeInOut, range(0.2, 0.4));
const bottomRight = compose(easeInOut, range(0.4, 0.6));
const bottomLeft  = compose(easeInOut, range(0.6, 0.8));

export default class extends Scene {
  private readonly LOOPS = 2;
  private readonly MIN_SCALE = 1;
  private readonly MAX_SCALE = 2;
  private readonly SQUARE_SIZE = this.width / 5;
  private readonly BLACK_COLOR = 'black';
  private readonly WHITE_COLOR = 'white';

  draw (frame: Frame) {
    const { ctx, width, height, LOOPS, MIN_SCALE, MAX_SCALE, SQUARE_SIZE, BLACK_COLOR, WHITE_COLOR } = this;
    const { progress } = frame;
    const t = loop(LOOPS)(progress);
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = WHITE_COLOR;
    const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * t;
    ctx.globalCompositeOperation = 'xor';
    // Top left
    {
      const startX = -1.5;
      const startY = -1.5;
      const endX = -0.75;
      const endY = -0.75;
      const deltX = endX - startX;
      const deltY = endY - startY;
      const pos = topLeft(t);
      const x = startX + deltX * pos;
      const y = startY + deltY * pos;
      ctx.fillRect(
        Math.round(x * SQUARE_SIZE * scale),
        Math.round(y * SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
      );
    }
    // Top right
    {
      const startX = 0.5;
      const startY = -1.5;
      const endX = -0.25;
      const endY = -0.75;
      const deltX = endX - startX;
      const deltY = endY - startY;
      const pos = topRight(t);
      const x = startX + deltX * pos;
      const y = startY + deltY * pos;
      ctx.fillRect(
        Math.round(x * SQUARE_SIZE * scale),
        Math.round(y * SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
      );
    }
    // Bottom right
    {
      const startX = 0.5;
      const startY = 0.5;
      const endX = -0.25;
      const endY = -0.25;
      const deltX = endX - startX;
      const deltY = endY - startY;
      const pos = bottomRight(t);
      const x = startX + deltX * pos;
      const y = startY + deltY * pos;
      ctx.fillRect(
        Math.round(x * SQUARE_SIZE * scale),
        Math.round(y * SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
      );
    }
    // Bottom left
    {
      const startX = -1.5;
      const startY = 0.5;
      const endX = -0.75;
      const endY = -0.25;
      const deltX = endX - startX;
      const deltY = endY - startY;
      const pos = bottomLeft(t);
      const x = startX + deltX * pos;
      const y = startY + deltY * pos;
      ctx.fillRect(
        Math.round(x * SQUARE_SIZE * scale),
        Math.round(y * SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
        Math.round(SQUARE_SIZE * scale),
      );
    }
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = BLACK_COLOR
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }
}
