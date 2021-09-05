import type { ImageData } from 'canvas';
import { Scene } from '../scene';
import { getContext } from '../context';
import { Frame } from '../frame';

const PI = Math.PI;
const TAU = 2 * PI;

export interface Spirograph {
  (t: number): { x: number, y: number };
}

/**
 * Generate a spirograph function.
 * @param {number} r Radius of the spirograph
 * @param {number} k (0 - 1) Ratio of inner circle to outer circle.
 * @param {number} l (0 - 1) Hole distance from center of inner circle.
 */
export const createSpirograph = (r: number, k: number, l: number): Spirograph => (t: number) => ({
  x: r * ((1 - k) * Math.cos(t) + l * k * Math.cos((1 - k) / k * t)),
  y: r * ((1 - k) * Math.sin(t) + l * k * Math.sin((1 - k) / k * t)),
});

export const findLength = (spirograph: Spirograph, resolution = 0.0001, tolerance = 0.01, limit = 1_000_000) => {
  const initial = spirograph(0);
  let started = false;
  for (let i = 0; i < limit; i++) {
    const t = i * resolution;
    const current = spirograph(t);
    const deltaX = current.x - initial.x;
    const deltaY = current.y - initial.y;
    if (Math.abs(deltaX) < tolerance && Math.abs(deltaY) < tolerance) {
      if (started) {
        return t;
      }
    } else {
      started = true;
    }
  }
  return NaN;
};

export default class extends Scene {
  protected readonly SCALE = this.width / 20;
  protected readonly TRIANGLE_WIDTH = this.SCALE;
  protected readonly TRIANGLE_HEIGHT = this.TRIANGLE_WIDTH * Math.sin(TAU / 3);
  protected readonly MIN_SCALE = 0.9;
  protected readonly MAX_SCALE = 0.5;
  protected readonly DELTA_SCALE = this.MAX_SCALE - this.MIN_SCALE;

  protected readonly srcCanvas = this.utils.createCanvas(this.width, this.height);
  protected readonly srcCtx = getContext(this.srcCanvas);
  protected readonly spirograph = createSpirograph(this.width / 2, 0.75, 0.575);
  protected readonly spirographLength = findLength(this.spirograph);

  draw (frame: Frame) {
    this.clear();
    // Draw source spirograph
    this.srcCtx.clearRect(0, 0, this.width, this.height);
    this.drawSpirograph(this.srcCtx, frame);
    // Draw triangles
    this.drawBackground();
    // Draw dest spirograph
    this.drawSpirograph(this.ctx, frame);
    this.drawTriangles();
  }

  drawBackground () {
    const { ctx, width, height } = this;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
  }

  drawTriangles () {
    const { ctx, srcCtx, width, height, TRIANGLE_WIDTH, TRIANGLE_HEIGHT, MIN_SCALE, DELTA_SCALE } = this;
    const imageData = srcCtx.getImageData(0, 0, width, height);
    const w = TRIANGLE_WIDTH;
    const h = TRIANGLE_HEIGHT;
    const countX = width / w * 2;
    const countY = height / h;
    ctx.beginPath();
    for (let gridY = -3; gridY < countY + 3; gridY++) {
      for (let gridX = -3; gridX < countX + 3; gridX++) {
        const odd = gridX % 2;
        const x = gridX * w / 2 + (gridY % 2 ? w / 2 : 0);
        const y = gridY * h - (odd ? (1 / 3) * h : 0);
        const val = this.getPixelValue(imageData, x, y);
        const scale = MIN_SCALE + val * DELTA_SCALE;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(odd ? PI : 0);
        ctx.scale(scale, scale);
        this.drawTriangle();
        ctx.restore();
      }
    }
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  getPixelValue (imageData: ImageData, x: number, y: number) {
    const { width, height } = this;
    x *= 0.8;
    x += width * 0.1;
    y *= 0.8;
    y += height * 0.1;
    x = Math.round(x);
    y = Math.round(y);
    // If coords are out of bounds return 0
    if (x < 0 || x > width || y < 0 || y > height) return 0;
    const i = x + y * width;
    return imageData.data[i * 4 + 3] / 0x100;
  }

  drawTriangle () {
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

  drawSpirograph (ctx: CanvasRenderingContext2D, frame: Frame) {
    const { width, height, spirograph, spirographLength } = this;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    const t = frame.progress * spirographLength;
    const { x, y } = spirograph(t);
    this.drawRadialGradient(ctx, x, y, this.width / 20, this.width / 2);
    ctx.restore();
  }

  drawSpirographPath (ctx: CanvasRenderingContext2D) {
    const { spirograph, spirographLength } = this;
    const tInc = 0.01;
    ctx.beginPath();
    for (let t = 0; t < spirographLength; t += tInc) {
      const { x, y } = spirograph(t);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drawRadialGradient (ctx: CanvasRenderingContext2D, x: number, y: number, r1: number, r2: number) {
    const grad = ctx.createRadialGradient(x, y, r1, x, y, r2);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}
