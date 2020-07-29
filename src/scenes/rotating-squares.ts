import { Scene } from '../scene';
import { Frame } from '../frame';

export default class RotatingSquaresScene extends Scene {
  private readonly SQUARE_SIZE = this.width / 4;
  private readonly BLACK_COLOR = 'black';
  private readonly WHITE_COLOR = 'white';

  draw (frame: Frame) {
    const { progress } = frame;
    const angle = progress * Math.PI;
    if (progress > 0.5) this.drawBlack(angle);
    else this.drawWhite(angle);
  }

  drawBlackSquares (angle: number) {
    const { ctx, SQUARE_SIZE } = this;
    // Top left
    ctx.save();
    ctx.translate(SQUARE_SIZE * 0.5, SQUARE_SIZE * 0.5);
    ctx.rotate(angle);
    ctx.rect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
    ctx.restore();
    // Bottom right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 1.5, SQUARE_SIZE * 1.5);
    ctx.rotate(angle);
    ctx.rect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
    ctx.restore();
  }

  drawWhiteSquares (angle: number) {
    const { ctx, SQUARE_SIZE } = this;
    // Top left
    ctx.save();
    ctx.translate(SQUARE_SIZE * 1.5, SQUARE_SIZE * 0.5);
    ctx.rotate(angle);
    ctx.rect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
    ctx.restore();
    // Bottom right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 0.5, SQUARE_SIZE * 1.5);
    ctx.rotate(angle);
    ctx.rect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
    ctx.restore();
  }

  drawBlack (angle: number) {
    const { ctx, width, height, SQUARE_SIZE, WHITE_COLOR, BLACK_COLOR } = this;
    ctx.fillStyle = WHITE_COLOR;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();

    // Top left
    this.drawBlackSquares(angle);

    // Bottom left
    ctx.save();
    ctx.translate(0, SQUARE_SIZE * 2);
    this.drawBlackSquares(angle);
    ctx.restore();

    // Top right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 2, 0);
    this.drawBlackSquares(angle);
    ctx.restore();

    // Bottom right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 2, SQUARE_SIZE * 2);
    this.drawBlackSquares(angle);
    ctx.restore();

    ctx.closePath();
    ctx.fillStyle = BLACK_COLOR;
    ctx.fill();
  }

  drawWhite (angle: number) {
    const { ctx, width, height, SQUARE_SIZE, WHITE_COLOR, BLACK_COLOR } = this;
    ctx.fillStyle = BLACK_COLOR;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();

    // Top left
    this.drawWhiteSquares(angle);

    // Bottom left
    ctx.save();
    ctx.translate(0, SQUARE_SIZE * 2);
    this.drawWhiteSquares(angle);
    ctx.restore();

    // Top right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 2, 0);
    this.drawWhiteSquares(angle);
    ctx.restore();

    // Bottom right
    ctx.save();
    ctx.translate(SQUARE_SIZE * 2, SQUARE_SIZE * 2);
    this.drawWhiteSquares(angle);
    ctx.restore();

    ctx.closePath();
    ctx.fillStyle = WHITE_COLOR;
    ctx.fill();
  }

}
