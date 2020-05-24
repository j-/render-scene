import { Info } from './info';

export interface Frame {
  /**
   * A value between 0 and 1 representing the amount of time that has passed
   * in this scene.
   */
  readonly progress: number;

  /**
   * The number of frames which have already elapsed in this scene.
   */
  readonly framesElapsed: number;

  /**
   * The number of frames which are remaining in this scene.
   */
  readonly framesRemaining: number;

  /**
   * The number of milliseconds which have already elapsed in this scene.
   */
  readonly timeElapsedMs: number;

  /**
   * The number of milliseconds which are remaining in this scene.
   */
  readonly timeRemainingMs: number;
}

export function buildFrame(options: Pick<Frame, 'timeElapsedMs'>, info: Info): Frame;
export function buildFrame(options: Pick<Frame, 'framesElapsed'>, info: Info): Frame;
export function buildFrame(options: Partial<Frame>, info: Info): Frame {
  const { totalTimeMs, totalFrames, frameIntervalMs } = info;
  let { timeElapsedMs, framesElapsed } = options;

  if (timeElapsedMs !== undefined) {
    timeElapsedMs = Math.round(timeElapsedMs % totalTimeMs);
    const progress = timeElapsedMs / totalTimeMs;
    const framesElapsed = Math.round(progress * totalFrames);
    const framesRemaining = totalFrames - framesElapsed;
    const timeRemainingMs = totalTimeMs - timeElapsedMs;
    return {
      progress,
      framesElapsed,
      framesRemaining,
      timeElapsedMs,
      timeRemainingMs,
    };
  }

  if (framesElapsed !== undefined) {
    const progress = framesElapsed / totalFrames;
    const framesRemaining = totalFrames - framesElapsed;
    const timeElapsedMs = framesElapsed * frameIntervalMs;
    const timeRemainingMs = totalTimeMs - timeElapsedMs;
    return {
      progress,
      framesElapsed,
      framesRemaining,
      timeElapsedMs,
      timeRemainingMs,
    };
  }

  throw new Error('Invalid arguments');
}
