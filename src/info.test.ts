import { buildInfo } from './info';

describe('buildInfo()', () => {
  describe('total frames and total time', () => {
    test('1000ms / 25 frames', () => {
      const actual = buildInfo({
        totalFrames: 25,
        totalTimeMs: 1000,
      });
      expect(actual).toEqual({
        totalFrames: 25,
        totalTimeMs: 1000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('2000ms / 50 frames', () => {
      const actual = buildInfo({
        totalFrames: 50,
        totalTimeMs: 2000,
      });
      expect(actual).toEqual({
        totalFrames: 50,
        totalTimeMs: 2000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('3000ms / 180 frames', () => {
      const actual = buildInfo({
        totalFrames: 180,
        totalTimeMs: 3000,
      });
      expect(actual).toEqual({
        totalFrames: 180,
        totalTimeMs: 3000,
        frameIntervalMs: 17,
        framesPerSecond: 60,
      });
    });
  });
  describe('total frames and frames per second', () => {
    test('100 frames @ 25 fps', () => {
      const actual = buildInfo({
        totalFrames: 100,
        framesPerSecond: 25,
      });
      expect(actual).toEqual({
        totalFrames: 100,
        totalTimeMs: 4000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('90 frames @ 30 fps', () => {
      const actual = buildInfo({
        totalFrames: 90,
        framesPerSecond: 30,
      });
      expect(actual).toEqual({
        totalFrames: 90,
        totalTimeMs: 3000,
        frameIntervalMs: 33,
        framesPerSecond: 30,
      });
    });
  });
  describe('total time and frames per second', () => {
    test('25 fps for 4 seconds', () => {
      const actual = buildInfo({
        totalTimeMs: 4000,
        framesPerSecond: 25,
      });
      expect(actual).toEqual({
        totalFrames: 100,
        totalTimeMs: 4000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('30 fps for 5 seconds', () => {
      const actual = buildInfo({
        totalTimeMs: 5000,
        framesPerSecond: 30,
      });
      expect(actual).toEqual({
        totalFrames: 150,
        totalTimeMs: 5000,
        frameIntervalMs: 33,
        framesPerSecond: 30,
      });
    });
  });
  describe('total time and frames interval', () => {
    test('40ms intervals for 4 seconds', () => {
      const actual = buildInfo({
        totalTimeMs: 4000,
        frameIntervalMs: 40,
      });
      expect(actual).toEqual({
        totalFrames: 100,
        totalTimeMs: 4000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('33ms intervals for 5 seconds', () => {
      const actual = buildInfo({
        totalTimeMs: 5000,
        frameIntervalMs: 33,
      });
      expect(actual).toEqual({
        totalFrames: 152,
        totalTimeMs: 5000,
        frameIntervalMs: 33,
        framesPerSecond: 30,
      });
    });
  });
  describe('total frames and frames interval', () => {
    test('40ms intervals for 100 frames', () => {
      const actual = buildInfo({
        totalFrames: 100,
        frameIntervalMs: 40,
      });
      expect(actual).toEqual({
        totalFrames: 100,
        totalTimeMs: 4000,
        frameIntervalMs: 40,
        framesPerSecond: 25,
      });
    });
    test('33ms intervals for 150 frames', () => {
      const actual = buildInfo({
        totalFrames: 150,
        frameIntervalMs: 33,
      });
      expect(actual).toEqual({
        totalFrames: 150,
        totalTimeMs: 4950,
        frameIntervalMs: 33,
        framesPerSecond: 30,
      });
    });
  });
});
