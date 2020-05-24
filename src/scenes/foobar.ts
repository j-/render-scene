import SceneWithDiagnostics from './with-diagnostics';
import { Frame } from '../frame';
import { Info } from '../info';

export default class FoobarScene extends SceneWithDiagnostics {
  draw (frame: Frame, info: Info) {
    super.draw(frame, info);
    const { ctx, width, height } = this;
    const xMid = width / 2;
    const yMid = height / 2;
    const r = Math.min(xMid, yMid) * 0.9;
    const p = frame.progress;
    const a = Math.PI * 2 * p;
    const x = Math.sin(a) * r;
    const y = Math.cos(a) * r;
    const size = r * 0.1;
    ctx.beginPath();
    ctx.arc(xMid + x, yMid + y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
