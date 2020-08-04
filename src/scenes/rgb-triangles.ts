import { Scene } from '../scene';
import { Frame } from '../frame';

const PI = Math.PI;
const TAU = 2 * PI;

export default class extends Scene {
  protected readonly SCALE = this.width / 10;
  protected readonly TRIANGLE_WIDTH = this.SCALE;
  protected readonly TRIANGLE_HEIGHT = this.TRIANGLE_WIDTH * Math.sin(TAU / 3);

  draw (_frame: Frame) {
    const { ctx, width, height, TRIANGLE_WIDTH, TRIANGLE_HEIGHT } = this;
    this.clear();
    const w = TRIANGLE_WIDTH;
    const h = TRIANGLE_HEIGHT;

    const countX = width / w * 2 + 1;
    const countY = height / h;

    for (let y = 0; y < countY; y++) {
      for (let x = -1; x < countX; x++) {
        const i = (Math.floor(y / 2) + x) % 3;
        const color = `hsl(${i * 120}, 80%, 80%)`;
        const odd = x % 2;
        ctx.save();
        ctx.translate(x * w / 2 + (y % 2 ? w / 2 : 0), y * h);
        ctx.scale(1, odd ? -1 : 1);
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
    const x0 = 0;
    const y0 = -TRIANGLE_HEIGHT / 2;
    const x1 = TRIANGLE_WIDTH / 2;
    const y1 = TRIANGLE_HEIGHT / 2;
    const x2 = -TRIANGLE_WIDTH / 2;
    const y2 = TRIANGLE_HEIGHT / 2;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
  }
}
