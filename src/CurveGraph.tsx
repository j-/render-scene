import * as React from 'react';
import { Curve } from './curve';

export interface Props {
  curve: Curve
}

const CurveGraph: React.FC<Props> = ({ curve }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const precision = 0.01;
    // Draw box
    ctx.translate(width * 0.05, height * 0.05);
    ctx.scale(0.9, 0.9);
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    // Draw curve
    ctx.beginPath();
    for (let i = 0; i <= 1; i += precision) {
      ctx.lineTo(i * width, (1 - curve(i)) * height);
    }
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#008';
    ctx.stroke();
  }, [curve]);

  return <canvas width={500} height={500} ref={canvasRef} />;
};

export default CurveGraph;
