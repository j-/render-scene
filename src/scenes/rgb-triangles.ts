import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, range, multiply, easeInOut } from '../curve';

const PI = Math.PI;
const TAU = 2 * PI;

export default class extends Scene {
  protected readonly SCALE = this.width / 10;
  protected readonly TRIANGLE_WIDTH = this.SCALE;
  protected readonly TRIANGLE_HEIGHT = this.TRIANGLE_WIDTH * Math.sin(TAU / 3);

  draw (frame: Frame) {
    const { ctx, width, height, TRIANGLE_WIDTH, TRIANGLE_HEIGHT } = this;
    const { progress } = frame;
    this.clear();
    const w = TRIANGLE_WIDTH;
    const h = TRIANGLE_HEIGHT;

    const countX = width / w * 2;
    const countY = height / h;

    for (let y = -3; y < countY + 3; y++) {
      for (let x = -3; x < countX + 3; x++) {
        const i = (Math.floor(y / 2) + x) % 3;
        const color = `hsl(${i * 120}, 80%, 80%)`;
        const odd = x % 2;
        const rotate = compose(
          // Rotate one third so the orientation is still "up" (or "down")
          multiply(TAU / 3),
          // Ease the rotation
          easeInOut,
          // Rotate for part of this color's turn
          range(0.2, 0.8),
          // Only move one color at a time
          range(i * 1 / 3, (i + 1) * 1 / 3),
        )(progress);
        ctx.save();
        ctx.translate(
          x * w / 2 + (y % 2 ? w / 2 : 0),
          y * h - (odd ? (1 / 3) * h : 0),
        );
        ctx.rotate(odd ? rotate + PI : rotate);
        ctx.beginPath();
        this.drawShapePath();
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  drawShapePath () {
    const { ctx, TRIANGLE_WIDTH, TRIANGLE_HEIGHT } = this;
    const midX = 1 / 2;
    const midY = 2 / 3;
    const x0 = 0;
    const y0 = TRIANGLE_HEIGHT * -midY;
    const x1 = TRIANGLE_WIDTH * midX;
    const y1 = TRIANGLE_HEIGHT * (1 - midY);
    const x2 = TRIANGLE_WIDTH * -midX;
    const y2 = TRIANGLE_HEIGHT * (1 - midY);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
  }
}
