import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, loop, multiply, turn } from '../curve';

export default class extends Scene {
  protected readonly LOOPS = 2;
  protected readonly X_COUNT = 10;
  protected readonly X_SIZE = this.width / (3 * this.X_COUNT);

  draw (frame: Frame) {
    const { ctx, width, height, LOOPS, X_SIZE } = this;
    const { progress } = frame;
    this.clear();
    const loopedProgress = loop(LOOPS)(progress);
    ctx.fillStyle = loopedProgress < 0.5 ? 'white' : 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(X_SIZE, X_SIZE);
    const angle = compose(multiply(0.25), turn)(progress);
    ctx.rotate(angle);
    this.drawOrganism(X_SIZE * -1.5, X_SIZE * -1.5, this.X_COUNT, frame);
    ctx.restore();
  }

  drawPath () {
    const { ctx } = this;
    ctx.beginPath();
    let x = -2; let y = -1;
    ctx.moveTo(x, y);
    x += 1; y += -1;
    ctx.lineTo(x, y);
    x += 1; y += 1;
    ctx.lineTo(x, y);
    x += 1; y += -1;
    ctx.lineTo(x, y);
    x += 1; y += 1;
    ctx.lineTo(x, y);
    x += -1; y += 1;
    ctx.lineTo(x, y);
    x += 1; y += 1;
    ctx.lineTo(x, y);
    x += -1; y += 1;
    ctx.lineTo(x, y);
    x += -1; y += -1;
    ctx.lineTo(x, y);
    x += -1; y += 1;
    ctx.lineTo(x, y);
    x += -1; y += -1;
    ctx.lineTo(x, y);
    x += 1; y += -1;
    ctx.lineTo(x, y);
    ctx.closePath();
  }

  drawAtom (x: number, y: number, frame: Frame) {
    const { ctx, LOOPS } = this;
    const { progress } = frame;
    const isOdd = x % 2;
    ctx.save();
    ctx.translate(x, y);
    const angle = compose(
      multiply(isOdd ? 1 : -1),
      multiply(0.5),
      turn,
      loop(2),
    )(progress);
    ctx.rotate(angle);
    const loopedProgress = loop(LOOPS)(progress);
    if (isOdd && loopedProgress < 0.5) {
      ctx.fillStyle = 'black';
      this.drawPath();
      ctx.fill();
    }
    if (!isOdd && loopedProgress >= 0.5) {
      ctx.fillStyle = 'white';
      this.drawPath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawMolecule (x: number, y: number, frame: Frame) {
    // Evens
    this.drawAtom(x + 0, y + 0, frame);
    this.drawAtom(x + 4, y - 2, frame);
    this.drawAtom(x + 2, y + 4, frame);
    this.drawAtom(x + 6, y + 2, frame);
    this.drawAtom(x - 2, y + 6, frame);
    // Odds
    this.drawAtom(x + 3, y + 1, frame);
    this.drawAtom(x + 7, y - 1, frame);
    this.drawAtom(x - 1, y + 3, frame);
    this.drawAtom(x + 1, y + 7, frame);
    this.drawAtom(x + 5, y + 5, frame);
  }

  drawOrganism (x: number, y: number, count: number, frame: Frame) {
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        this.drawMolecule(
          x + i * 10,
          y + j * 10,
          frame,
        );
      }
    }
  }
}
