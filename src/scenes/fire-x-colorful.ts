import FireX from './fire-x';
import { Frame } from '../frame';
import { hslToRgb } from '../color';
import { compose, pow, phase, multiply } from '../curve';

export default class extends FireX {
  draw (frame: Frame) {
    const { CHANNELS } = this;
    const colors = CHANNELS.length / 3;
    for (let i = 0; i < colors; i++) {
      const h = compose(
        pow(1.5),
        phase(frame.progress * -10),
        multiply(1 / colors),
      )(colors - i);
      const s = 1;
      const l = (i / colors) ** 0.2 * 0.75;
      [
        CHANNELS[i * 3 + 0],
        CHANNELS[i * 3 + 1],
        CHANNELS[i * 3 + 2],
      ] = hslToRgb(h, s, l);
    }
    super.draw(frame);
  }
}
