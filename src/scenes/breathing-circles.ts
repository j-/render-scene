import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, loop, multiply, phase, sin, square } from '../curve';
import { getContext } from '../context';

const { PI } = Math;
const TAU = PI * 2;

export default class extends Scene {
  protected readonly NUM_RINGS = 50;
  protected readonly MIN_RADIUS = this.width / 50;
  protected readonly MAX_RADIUS = this.width / 40;
  protected readonly RADIUS_DELTA = this.width / 25;

  private readonly bufferCanvas = this.utils.createCanvas(this.width, this.height);
  private readonly bufferCtx = getContext(this.bufferCanvas);

  draw (frame: Frame) {
    const { ctx, bufferCtx, width, height } = this;
    this.clear();
    this.drawBuffer(frame);
    const bufferImageData = bufferCtx.getImageData(0, 0, width, height);
    const imageData = ctx.createImageData(width, height);
    const modifierR = 1.000;
    const modifierG = 0.975;
    const modifierB = 0.950;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const xx = (width / 2) - x;
        const yy = (height / 2) - y;
        const index = (x + y * width) * 4;
        const angle = Math.atan2(xx, yy);
        const distance = Math.sqrt(xx ** 2 + yy ** 2);
        const bufferRx = Math.round(width / 2 + Math.sin(angle) * distance * modifierR);
        const bufferRy = Math.round(height / 2 + Math.cos(angle) * distance * modifierR);
        const bufferRindex = (bufferRx + bufferRy * width) * 4;
        const bufferGx = Math.round(width / 2 + Math.sin(angle) * distance * modifierG);
        const bufferGy = Math.round(height / 2 + Math.cos(angle) * distance * modifierG);
        const bufferGindex = (bufferGx + bufferGy * width) * 4;
        const bufferBx = Math.round(width / 2 + Math.sin(angle) * distance * modifierB);
        const bufferBy = Math.round(height / 2 + Math.cos(angle) * distance * modifierB);
        const bufferBindex = (bufferBx + bufferBy * width) * 4;
        imageData.data[index + 0] = bufferImageData.data[bufferRindex + 0];
        imageData.data[index + 1] = bufferImageData.data[bufferGindex + 1];
        imageData.data[index + 2] = bufferImageData.data[bufferBindex + 2];
        imageData.data[index + 3] = 0xff;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  drawBuffer (frame: Frame) {
    const ctx = this.bufferCtx;
    const { width, height, NUM_RINGS, MIN_RADIUS, MAX_RADIUS, RADIUS_DELTA } = this;
    const { progress } = frame;
    this.clear();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    let distance = 0;
    for (let ring = 0; ring < NUM_RINGS; ring++) {
      const count = Math.floor(1 + ring * 4 + ring ** 1.1);
      const radius = compose(
        multiply(MIN_RADIUS + (1 - ring / NUM_RINGS) * (MAX_RADIUS - MIN_RADIUS)),
        square,
        sin,
        phase(ring / NUM_RINGS * - 4),
        loop(2),
      )(progress);
      for (let circle = 0; circle < count; circle++) {
        const angle = circle / count * TAU;
        const x = Math.sin(angle) * distance;
        const y = Math.cos(angle) * distance;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, TAU);
      }
      distance += radius + RADIUS_DELTA * (1 - (ring / NUM_RINGS));
    }
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
}
