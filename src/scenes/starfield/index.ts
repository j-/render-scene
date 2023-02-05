// import { AudioContext } from 'web-audio-api';
import { Scene } from '../../scene';
import { Frame } from '../../frame';
import { compose, loop, phase } from '../../curve';
import { guess } from 'web-audio-beat-detector';
import 'canvas-5-polyfill';

const AudioContext = globalThis.AudioContext || require('web-audio-api').AudioContext;

const { PI } = Math;
const TAU = 2 * PI;

const lerp = (min: number, max: number, value: number) => (
  min + (max - min) * value
);

const logo = new Path2D('M 29.25 -1.5 V 25 H 52.25 V -1.5 C 52.25 -17.1 38.5833 -23.6667 31.75 -25 H -31.25 C -38.25 -23.5 -52.25 -16.3 -52.25 0.5 C -52.25 17.3 -38.25 23.8333 -31.25 25 H 24.75 V 2 H -26.75 V -1.5 H 29.25 Z');

export default class extends Scene {
  private readonly STARS = 2000;
  private readonly MIN_SIZE = this.width / 50000;
  private readonly MAX_SIZE = this.width / 100;
  private readonly MIN_ALPHA = 0.1;
  private readonly MAX_ALPHA = 2;

  async setup () {
    this.ctx.translate(this.width / 2, this.height / 2);
    const audio = await this.utils.loadFile('audio.mp3');
    const buf = await this.decode(audio);
    const { bpm, offset } = await guess(buf);
    console.log(bpm, offset);
  }

  async decode (audio: ArrayBuffer) {
    const context = new AudioContext();
    return new Promise<AudioBuffer>((resolve, reject) => {
      context.decodeAudioData(audio, resolve, reject);
    });
  }

  clear () {
    this.ctx.clearRect(this.width / -2, this.height / -2, this.width, this.height);
  }

  draw (frame: Frame) {
    this.clear();
    const { progress } = frame;
    const { STARS, MIN_SIZE, MAX_SIZE, MIN_ALPHA, MAX_ALPHA, width, ctx } = this;
    const maxDistance = width;
    for (let i = 0; i < STARS; i++) {
      ctx.save();
      const a = i / STARS * TAU;
      const p = compose(
        (t) => t === 0 ? 0 : Math.pow(2, 15 * t - 15),
        loop(1),
        phase(i / STARS * 123456789),
      )(progress);
      const d = p * maxDistance;
      const x = Math.sin(a) * d;
      const y = Math.cos(a) * d;
      ctx.translate(x, y);
      const size = lerp(MIN_SIZE, MAX_SIZE, p) * 1 / 10;
      ctx.scale(size, size);
      const alpha = lerp(MIN_ALPHA, MAX_ALPHA, p ** 3) * (i % 2 === 0 ? 1 : 2);
      ctx.fillStyle = `hsla(0, 100%, 100%, ${alpha})`;
      ctx.fill(logo);
      ctx.stroke(logo);
      ctx.restore();
    }

    const scale = 2;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.rotate(Math.sin(progress * 8 * PI) * PI / 16);
    ctx.fillStyle = '#fff';
    ctx.lineWidth = width / 50;
    ctx.stroke(logo);
    ctx.fill(logo);
    ctx.restore();
  }
}
