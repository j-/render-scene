import { buildFrame } from './frame';
import { buildInfo } from './info';

describe('buildFrame()', () => {
  describe('provide frames elapsed', () => {
    test('100 frames into a 1000 frame scene', () => {
      const info = buildInfo({
        framesPerSecond: 25,
        totalFrames: 1000,
      });
      const actual = buildFrame({
        framesElapsed: 100,
      }, info);
      expect(actual).toEqual({
        progress: 0.1,
        framesElapsed: 100,
        framesRemaining: 900,
        timeElapsedMs: 4000,
        timeRemainingMs: 36000,
      });
    });
  });
});
