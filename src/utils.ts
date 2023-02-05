import { createCanvas } from './canvas';
import { loadFile } from './file';
import { loadImage } from './image';

export interface Utils {
  createCanvas: typeof createCanvas;
  loadImage: typeof loadImage;
  loadFile: typeof loadFile;
}

export const utils: Utils = {
  createCanvas,
  loadImage,
  loadFile,
};
