import { Boxes, Points } from './types';
import { boxToPoints } from './boxes-to-points';

export const boxesToSpiral = (boxes: Boxes): Points => {
  if (boxes.length < 2) return [];
  const firstBox = boxes[0];
  const lastBox = boxes[boxes.length - 1];
  const points: Points = [[firstBox[0], firstBox[1]]];
  for (let i = 0; i < boxes.length - 1; i++) {
    const box0 = boxes[i + 0];
    const box1 = boxes[i + 1];
    const points0 = boxToPoints(box0);
    const points1 = boxToPoints(box1);
    for (let j = 0; j < 4; j++) {
      const p = j / 4;
      const [x0, y0] = points0[j];
      const [x1, y1] = points1[j];
      points.push([x0 + (x1 - x0) * p, y0 + (y1 - y0) * p]);
    }
  }
  points.push([lastBox[0], lastBox[1]]);
  return points;
};
