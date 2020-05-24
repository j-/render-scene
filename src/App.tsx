import * as React from 'react';
import MainScene from './scenes/colors';
import { buildInfo } from './info';
import { buildFrame } from './frame';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const TOTAL_TIME_MS = 30000;
const FRAMES_PER_SECOND = 30;

const info = buildInfo({
  totalTimeMs: TOTAL_TIME_MS,
  framesPerSecond: FRAMES_PER_SECOND,
});

const App: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const scene = new MainScene(canvas, ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    const loop = (time: number) => {
      const frame = buildFrame({
        timeElapsedMs: time % TOTAL_TIME_MS,
      }, info);
      scene.draw(frame, info);
      clock = requestAnimationFrame(loop);
    };
    let clock = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(clock);
  }, []);
  
  return (
    <div className="App">
      <h1>Scene</h1>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
