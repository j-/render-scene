import { Scene } from '../scene';
import { Frame } from '../frame';
import { compose, loop, multiply, turn } from '../curve';

const shapeX = new Path2D('M-2-1l1-1 1 1 1-1 1 1-1 1 1 1-1 1-1-1-1 1-1-1 1-1z');

export default class extends Scene {
  protected readonly X_COUNT = 10;
  protected readonly X_SIZE = this.width / (3 * this.X_COUNT);

  draw (frame: Frame) {
    const { ctx, width, height, X_SIZE } = this;
    const { progress } = frame;
    this.clear();
    ctx.fillStyle = progress < 0.5 ? 'white' : 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.scale(X_SIZE, X_SIZE);
    this.drawOrganism(0, 0, this.X_COUNT / 3, frame);
    ctx.restore();
  }

  drawAtom (x: number, y: number, frame: Frame) {
    const { ctx } = this;
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
    if (isOdd && progress < 0.5) {
      ctx.fillStyle = 'black';
      ctx.fill(shapeX);
    }
    if (!isOdd && progress > 0.5) {
      ctx.fillStyle = 'white';
      ctx.fill(shapeX);
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
