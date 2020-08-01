import RandomLoopsScene from './random-loops';
import { sin, compose, multiply } from '../curve';

export default class FatLoopsScene extends RandomLoopsScene {
  protected readonly LINE_WIDTH = this.width / 50;

  transition (progress: number) {
    const { ctx, width, height } = this;
    ctx.translate(-width + compose(multiply(width), sin)(progress), progress * height * -2);
  }
}
