import { Scene } from '../scene';
import { Frame } from '../frame';
import { turn } from '../curve';

const { PI } = Math;
const TAU = PI * 2;

export default class extends Scene {
  protected readonly NUM_CIRCLES = 20;
  protected readonly MIN_RADIUS = this.width / 50;
  protected readonly MAX_RADIUS = this.width / 2.2;
  protected readonly LINE_WIDTH = this.width / 80;
  protected readonly POINT_RADIUS = this.width / 160;

  draw (frame: Frame) {
    const { ctx, width, height, NUM_CIRCLES, MIN_RADIUS, MAX_RADIUS, LINE_WIDTH, POINT_RADIUS } = this;
    const { progress } = frame;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    // Draw circles
    ctx.beginPath();
    for (let i = 0; i < NUM_CIRCLES; i++) {
      const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (i / NUM_CIRCLES);
      ctx.moveTo(radius, 0);
      ctx.arc(0, 0, radius, 0, TAU);
    }
    ctx.strokeStyle = '#444';
    ctx.lineWidth = width / 300;
    ctx.stroke();
    // Draw lines
    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH;
    for (let i = 0; i < NUM_CIRCLES; i++) {
      const rotations = i + 1;
      const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (i / NUM_CIRCLES);
      const angle = (rotations * turn(progress)) - PI;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;
      ctx.lineTo(x, y);
      const hue = (1 - i / NUM_CIRCLES) * 360;
      const color = `hsl(${hue}, 80%, 80%)`;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    // Draw points
    ctx.beginPath();
    for (let i = 0; i < NUM_CIRCLES; i++) {
      const rotations = i + 1;
      const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (i / NUM_CIRCLES);
      const angle = (rotations * turn(progress)) - PI;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;
      ctx.moveTo(x + POINT_RADIUS, y);
      ctx.arc(x, y, POINT_RADIUS, 0, TAU);
    }
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = width / 500;
    ctx.stroke();
    ctx.restore();
  }
}
