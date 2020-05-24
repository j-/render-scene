export interface Info {
  /**
   * How many milliseconds elapse between frames.
   */
  readonly frameIntervalMs: number;

  /**
   * How many frames occur within 1000 milliseconds.
   */
  readonly framesPerSecond: number;

  /**
   * The total number of frames for the scene.
   */
  readonly totalFrames: number;

  /**
   * The total number of milliseconds for the scene.
   */
  readonly totalTimeMs: number;
}

export function buildInfo(options: Pick<Info, 'totalFrames' | 'totalTimeMs'>): Info;
export function buildInfo(options: Pick<Info, 'totalFrames' | 'framesPerSecond'>): Info;
export function buildInfo(options: Pick<Info, 'totalFrames' | 'frameIntervalMs'>): Info;
export function buildInfo(options: Pick<Info, 'totalTimeMs' | 'framesPerSecond'>): Info;
export function buildInfo(options: Pick<Info, 'totalTimeMs' | 'frameIntervalMs'>): Info;
export function buildInfo(options: Partial<Info>): Info {
  if (
    options.totalFrames !== undefined &&
    options.totalTimeMs !== undefined
  ) {
    const { totalFrames, totalTimeMs } = options;
    const frameIntervalMs = Math.round(totalTimeMs / totalFrames);
    const framesPerSecond = totalFrames / totalTimeMs * 1000;
    return {
      frameIntervalMs,
      framesPerSecond,
      totalFrames,
      totalTimeMs,
    };
  }

  if (
    options.totalFrames !== undefined &&
    options.framesPerSecond !== undefined
  ) {
    const { totalFrames, framesPerSecond } = options;
    const frameIntervalMs = Math.round(1000 / framesPerSecond);
    const totalTimeMs = totalFrames / framesPerSecond * 1000;
    return {
      frameIntervalMs,
      framesPerSecond,
      totalFrames,
      totalTimeMs,
    };
  }

  if (
    options.totalFrames !== undefined &&
    options.frameIntervalMs !== undefined
  ) {
    const { totalFrames, frameIntervalMs } = options;
    const framesPerSecond = Math.round(1000 / frameIntervalMs);
    const totalTimeMs = totalFrames * frameIntervalMs;
    return {
      frameIntervalMs,
      framesPerSecond,
      totalFrames,
      totalTimeMs,
    };
  }

  if (
    options.totalTimeMs !== undefined &&
    options.framesPerSecond !== undefined
  ) {
    const { totalTimeMs, framesPerSecond } = options;
    const frameIntervalMs = Math.round(1000 / framesPerSecond);
    const totalFrames = Math.round(totalTimeMs * framesPerSecond / 1000);
    return {
      frameIntervalMs,
      framesPerSecond,
      totalFrames,
      totalTimeMs,
    };
  }

  if (
    options.totalTimeMs !== undefined &&
    options.frameIntervalMs !== undefined
  ) {
    const { totalTimeMs, frameIntervalMs } = options;
    const framesPerSecond = Math.round(1000 / frameIntervalMs);
    const totalFrames = Math.round(totalTimeMs / frameIntervalMs);
    return {
      frameIntervalMs,
      framesPerSecond,
      totalFrames,
      totalTimeMs,
    };
  }

  throw new Error('Invalid arguments');
}
