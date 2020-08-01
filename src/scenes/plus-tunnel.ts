import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, turn, loop, phase } from '../curve';

export default class extends Scene {
  protected readonly ITERATIONS = 50;
  protected readonly MIN_SIZE = this.width / 500 * 40;
  protected readonly MAX_SIZE = this.width / 500 * 2000;
  protected readonly LAYER_OFFSET = this.width / 500 * 50;
  protected readonly LINE_WIDTH = this.width / 500;

  draw (frame: Frame) {
    const { ctx, width, height, ITERATIONS, MIN_SIZE, MAX_SIZE, LAYER_OFFSET, LINE_WIDTH } = this;
    const { progress } = frame;
    this.clear();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < ITERATIONS; i++) {
      const n = i / ITERATIONS;
      const scale = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * n;
      const angle = phase(compose(turn, loop(3)), n / -1)(progress);
      const hue = angle * 180 / Math.PI;
      ctx.fillStyle = `hsla(${hue}, 80%, 80%, 1)`;
      ctx.save();
      ctx.translate(
        LAYER_OFFSET * Math.sin(angle),
        LAYER_OFFSET * Math.cos(angle)
      );
      this.drawShapePath(scale);
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 80%, 40%, 1)`;
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(-width / 2, -width / 2, width, height);
    ctx.restore();
  }

  drawShapePath (scale: number) {
    const { ctx } = this;
    const m = 1 / 3 / 2 * scale;
    ctx.beginPath();
    ctx.moveTo(m * -1, m * -1);
    ctx.lineTo(m * -1, m * -3);
    ctx.lineTo(m * 1, m * -3);
    ctx.lineTo(m * 1, m * -1);
    ctx.lineTo(m * 3, m * -1);
    ctx.lineTo(m * 3, m * 1);
    ctx.lineTo(m * 1, m * 1);
    ctx.lineTo(m * 1, m * 3);
    ctx.lineTo(m * -1, m * 3);
    ctx.lineTo(m * -1, m * 1);
    ctx.lineTo(m * -3, m * 1);
    ctx.lineTo(m * -3, m * -1);
    ctx.closePath();
  }
}
