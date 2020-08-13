import { Points } from './types';
import { getTotalDistance, getDistance } from './distance';

export const getPartialLinePoints = (points: Points, target: number): Points => {
  const result: Points = [];
  const totalDistance = getTotalDistance(points);
  const targetDistance = target * totalDistance;

  const point0 = points[0];
  const [startX, startY] = point0;
  result.push([startX, startY]);
  let cumulativeDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i + 0];
    const [x1, y1] = points[i + 1];
    const distance = getDistance(x0, y0, x1, y1);
    if (cumulativeDistance + distance < targetDistance) {
      cumulativeDistance += distance;
      result.push([x1, y1]);
    } else {
      const distanceAtStart = cumulativeDistance;
      const ratioAtStart = distanceAtStart / totalDistance;
      const distanceAtEnd = distanceAtStart + distance;
      const ratioAtEnd = distanceAtEnd / totalDistance;
      const ratio = (target - ratioAtStart) / (ratioAtEnd - ratioAtStart);
      result.push([x0 + (x1 - x0) * ratio, y0 + (y1 - y0) * ratio]);
      break;
    }
  }
  return result;
};
