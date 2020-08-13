import { Box, Points } from './types';

export const boxToPoints = ([x, y, w, h]: Box): Points => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];
