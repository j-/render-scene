import { Scene } from '../../scene';
import { Frame } from '../../frame';
import { getContext } from '../../context';
import { compose, loop, phase, sin } from '../../curve';
import source from './source';

export default class extends Scene {
  protected readonly SQUARE_COUNT = 50;
  protected readonly SQUARE_SIZE = this.width / this.SQUARE_COUNT;
  protected readonly SOURCE_SIZE = this.SQUARE_COUNT;
  protected readonly BAND_COUNT = 10;
  protected readonly BAND_SIZE = this.SQUARE_COUNT / this.BAND_COUNT;

  protected readonly srcCanvas = this.utils.createCanvas(this.SOURCE_SIZE, this.SOURCE_SIZE);
  protected readonly srcCtx = getContext(this.srcCanvas);

  protected values: Uint8ClampedArray = new Uint8ClampedArray(this.SOURCE_SIZE * this.SOURCE_SIZE * 4);

  async setup () {
    const { srcCtx, values, SOURCE_SIZE } = this;
    const image = await this.utils.loadImage(source);
    const IMAGE_WIDTH = image.width;
    const IMAGE_HEIGHT = image.height;
    const IMAGE_MIN = Math.min(IMAGE_WIDTH, IMAGE_HEIGHT);
    const sx = (IMAGE_WIDTH - IMAGE_MIN) / 2;
    const sy = (IMAGE_HEIGHT - IMAGE_MIN) / 2;
    const sw = IMAGE_MIN;
    const sh = IMAGE_MIN;
    const dx = 0;
    const dy = 0;
    const dw = SOURCE_SIZE;
    const dh = SOURCE_SIZE;
    srcCtx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    const { data } = srcCtx.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE);
    for (let i = 0; i < data.length; i += 4) {
      values[i / 4] = 0xff - (
        data[i + 0] +
        data[i + 1] +
        data[i + 2]
      ) / 3;
    }
  }

  draw (frame: Frame) {
    const { ctx, width, height, values, SQUARE_COUNT, SQUARE_SIZE, BAND_SIZE } = this;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    for (let y = 0; y < SQUARE_COUNT; y++) {
      for (let x = 0; x < SQUARE_COUNT; x++) {
        ctx.save();
        const val = 0xff - values[y * SQUARE_COUNT + x] / 0xff;
        const i = Math.ceil((SQUARE_COUNT / 2 - y) / BAND_SIZE);
        const p = compose(
          sin,
          phase(val),
          loop(i),
        )(frame.progress);
        ctx.translate((x + 0.5) * SQUARE_SIZE, (y + 0.5) * SQUARE_SIZE);
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, p * SQUARE_SIZE / 1.8, 0, Math.PI * 2);
        ctx.restore();
      }
    }
    ctx.fillStyle = '#000';
    ctx.fill();
  }
}
