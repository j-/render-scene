import { createCanvas } from './canvas';
import { loadImage } from './image';

export interface Utils {
  createCanvas: typeof createCanvas;
  loadImage: typeof loadImage;
}

export const utils: Utils = {
  createCanvas,
  loadImage,
}
