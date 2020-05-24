import { createCanvas } from './canvas';

export interface Utils {
  createCanvas(width: number, height: number): HTMLCanvasElement;
}

export const utils: Utils = {
  createCanvas,
}
