import { Points } from './types';

export const getDistance = (x0: number, y0: number, x1: number, y1: number) => {
  return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
};

export const getTotalDistance = (points: Points) => {
  let total = 0;
  if (points.length < 2) return total;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i + 0];
    const [x1, y1] = points[i + 1];
    total += getDistance(x0, y0, x1, y1);
  }
  return total;
};
