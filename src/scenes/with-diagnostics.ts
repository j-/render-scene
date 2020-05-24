import { Scene } from '../scene';
import { Frame } from '../frame';
import { Info } from '../info';

export default class SceneWithDiagnostics extends Scene {
  draw (frame: Frame, info: Info) {
    this.clear();
    const { ctx } = this;
    ctx.fillText(`Progress: ${Math.round(frame.progress * 100)}%`, 10, 10);
    ctx.fillText(`Frames: ${info.totalFrames} total, ${frame.framesElapsed} elapsed, ${frame.framesRemaining} remaining`, 10, 20);
    ctx.fillText(`Time: ${info.totalTimeMs} total, ${frame.timeElapsedMs} elapsed, ${frame.timeRemainingMs} remaining`, 10, 30);
  }
}
