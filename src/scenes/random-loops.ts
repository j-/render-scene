import seedrandom from 'seedrandom';
import { Scene } from '../scene';
import { Frame } from '../frame';
import { sin, cos } from '../curve';

export default class RandomLoopsScene extends Scene {
  protected readonly GRID_SIZE = this.width / 20;
  protected readonly CIRCLE_RADIUS = this.GRID_SIZE / 2;
  protected readonly GRID_COUNT_X = Math.ceil(this.width / this.GRID_SIZE);
  protected readonly GRID_COUNT_Y = Math.ceil(this.height / this.GRID_SIZE);
  protected readonly LINE_WIDTH = this.width / 150;

  draw (frame: Frame) {
    const { ctx, width, height } = this;
    const { progress } = frame;
    this.clear();
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    this.transition(progress);
    this.drawAll();
    ctx.translate(0, height);
    this.drawAll();
    ctx.translate(0, height);
    this.drawAll();
    ctx.translate(0, height);
    this.drawAll();
    ctx.translate(width, height * -3);
    this.drawAll();
    ctx.translate(0, height);
    this.drawAll();
    ctx.translate(0, height);
    this.drawAll();
    ctx.restore();
  }

  drawCell () {
    const { ctx, CIRCLE_RADIUS } = this;
    // Arc 1
    ctx.moveTo(0, -CIRCLE_RADIUS);
    ctx.arc(-CIRCLE_RADIUS, -CIRCLE_RADIUS, CIRCLE_RADIUS, 0, Math.PI / 2);
    // Arc 2
    ctx.moveTo(0, CIRCLE_RADIUS);
    ctx.arc(CIRCLE_RADIUS, CIRCLE_RADIUS, CIRCLE_RADIUS, -Math.PI, -Math.PI / 2);
  }

  drawRow (y: number) {
    const { ctx, GRID_COUNT_X, GRID_COUNT_Y, GRID_SIZE, LINE_WIDTH } = this;
    for (let x = 0; x < GRID_COUNT_X; x++) {
      const seed = `(${x}, ${y})`;
      const rand = seedrandom(seed);
      const orientation = Math.floor(rand() * 4);
      ctx.save();
      ctx.translate((x + 0.5) * GRID_SIZE, 0);
      ctx.rotate(Math.PI / 2 * orientation);
      ctx.beginPath();
      this.drawCell();
      const hue = sin(y / GRID_COUNT_Y) + cos(x / GRID_COUNT_X);
      const color = `hsl(${hue * 360}, 80%, 80%)`;
      ctx.strokeStyle = color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawAll () {
    const { ctx, GRID_COUNT_Y, GRID_SIZE } = this;
    ctx.lineWidth = 2;
    for (let y = 0; y < GRID_COUNT_Y; y++) {
      ctx.save();
      ctx.translate(0, (y + 0.5) * GRID_SIZE);
      this.drawRow(y);
      ctx.restore();
    }
  }

  transition (progress: number) {
    const { ctx, width, height } = this;
    ctx.translate(progress * width * -1, progress * height * -2);
  }
}
