import seedrandom from 'seedrandom';
import { Scene, SceneConstructorParams } from '../scene';
import { Frame } from '../frame';
import { getContext } from '../context';
import { createImageData } from '../image-data';

const CHANNELS = [
  0x00, 0x00, 0x00,
  0x07, 0x07, 0x07,
  0x1f, 0x07, 0x07,
  0x2f, 0x0f, 0x07,
  0x47, 0x0f, 0x07,
  0x57, 0x17, 0x07,
  0x67, 0x1f, 0x07,
  0x77, 0x1f, 0x07,
  0x8f, 0x27, 0x07,
  0x9f, 0x2f, 0x07,
  0xaf, 0x3f, 0x07,
  0xbf, 0x47, 0x07,
  0xc7, 0x47, 0x07,
  0xdf, 0x4f, 0x07,
  0xdf, 0x57, 0x07,
  0xdf, 0x57, 0x07,
  0xd7, 0x5f, 0x07,
  0xd7, 0x67, 0x0f,
  0xcf, 0x6f, 0x0f,
  0xcf, 0x77, 0x0f,
  0xcf, 0x7f, 0x0f,
  0xcf, 0x87, 0x17,
  0xc7, 0x87, 0x17,
  0xc7, 0x8f, 0x17,
  0xc7, 0x97, 0x1f,
  0xbf, 0x9f, 0x1f,
  0xbf, 0x9f, 0x1f,
  0xbf, 0xa7, 0x27,
  0xbf, 0xa7, 0x27,
  0xbf, 0xaf, 0x2f,
  0xb7, 0xaf, 0x2f,
  0xb7, 0xb7, 0x2f,
  0xb7, 0xb7, 0x37,
  0xcf, 0xcf, 0x6f,
  0xdf, 0xdf, 0x9f,
  0xef, 0xef, 0xc7,
  0xff, 0xff, 0xff,
];

const MAX_TEMPERATURE = 36;

const getChannel = (channel: number, temperature: number) => (
  CHANNELS[channel + temperature * 3]
);

export default class extends Scene {
  protected readonly BORDER = 0;
  protected readonly BUFFER_WIDTH = 100;
  protected readonly BUFFER_HEIGHT = 100;
  protected readonly BUFFER_LENGTH = this.BUFFER_WIDTH * this.BUFFER_HEIGHT;
  protected readonly buffer = new Uint8ClampedArray(this.BUFFER_LENGTH);
  protected readonly data = new Uint8ClampedArray(this.BUFFER_LENGTH * 4);
  protected readonly bufferCanvas = this.utils.createCanvas(this.BUFFER_WIDTH, this.BUFFER_HEIGHT);
  protected readonly bufferCtx = getContext(this.bufferCanvas);
  protected readonly bufferID = createImageData(this.bufferCtx);
  protected random = seedrandom();

  constructor (...params: SceneConstructorParams) {
    super(...params);
    this.buffer.fill(0, 0, this.BUFFER_LENGTH);
  }

  draw (frame: Frame) {
    this.random = seedrandom(frame.framesElapsed.toString());
    this.doSource(frame);
    this.doFire();
    this.drawBackground();
    this.drawBuffer();
    this.copyBuffer();
  }

  doSource (frame: Frame) {
    const { buffer, BUFFER_LENGTH, BUFFER_WIDTH } = this;
    const temperature = frame.timeRemainingMs > 3000 ? MAX_TEMPERATURE : 0;
    buffer.fill(temperature, BUFFER_LENGTH - BUFFER_WIDTH, BUFFER_LENGTH);
  }

  doFire () {
    const { buffer, BUFFER_WIDTH, BUFFER_HEIGHT } = this;
    for (let x = 0; x < BUFFER_WIDTH; x++) {
      for (let y = 1; y < BUFFER_HEIGHT; y++) {
        const src = y * BUFFER_WIDTH + x;
        const rand = Math.round(this.random() * 3) & 3;
        const dst = src - rand + 1;
        buffer[dst - BUFFER_WIDTH] = buffer[src] - (rand & 1);
      }
    }
  }

  drawBackground () {
    const { ctx, width, height } = this;
    ctx.fillRect(0, 0, width, height);
  }

  drawBuffer () {
    const { buffer, bufferID, bufferCtx, BORDER, BUFFER_WIDTH, BUFFER_LENGTH } = this;
    for (let i = 0; i < BUFFER_LENGTH; i++) {
      const x = i % BUFFER_WIDTH;
      const y = Math.floor(i / BUFFER_WIDTH);
      const xx = Math.floor(Math.abs(x - BUFFER_WIDTH / 2 + 0.5));
      const yy = Math.floor(Math.abs(y - BUFFER_WIDTH / 2 + 0.5));
      const white = (
        xx - yy + Math.floor(BUFFER_WIDTH * 1 / 4 - 0.5) < BORDER ||
        yy - xx + Math.floor(BUFFER_WIDTH * 1 / 4 - 0.5) < BORDER ||
        -xx - yy + Math.floor(BUFFER_WIDTH * 3 / 4 - 0.5) < BORDER
      );
      const alpha = (
        xx - yy < BUFFER_WIDTH * 1 / 4 &&
        yy - xx < BUFFER_WIDTH * 1 / 4 &&
        xx + yy < BUFFER_WIDTH * 3 / 4
      );
      bufferID.data[i * 4 + 3] = alpha ? 0xff : 0;
      if (!alpha) continue;
      if (white) {
        bufferID.data[i * 4 + 0] = 0xff;
        bufferID.data[i * 4 + 1] = 0xff;
        bufferID.data[i * 4 + 2] = 0xff;
      } else {
        const temperature = buffer[i];
        bufferID.data[i * 4 + 0] = getChannel(0, temperature);
        bufferID.data[i * 4 + 1] = getChannel(1, temperature);
        bufferID.data[i * 4 + 2] = getChannel(2, temperature);
      }
    }
    bufferCtx.putImageData(bufferID, 0, 0);
  }

  copyBuffer () {
    const { ctx, bufferCanvas, width, height } = this;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bufferCanvas, 0, 0, width, height);
  }
}
