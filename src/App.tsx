import * as React from 'react';
import { Scene, SceneConstructor } from './scene';
import { buildInfo } from './info';
import { buildFrame } from './frame';
import { utils } from './utils';
import config from './config.json';

const SCENE_NAME = config.name;

const CANVAS_WIDTH = config.preview.width;
const CANVAS_HEIGHT = config.preview.height;

const TOTAL_TIME_MS = config.common.time;
const FRAMES_PER_SECOND = config.common.fps;

const info = buildInfo({
  totalTimeMs: TOTAL_TIME_MS,
  framesPerSecond: FRAMES_PER_SECOND,
});

const App: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const [MainScene, setMainScene] = React.useState<SceneConstructor | null>(null);

  React.useEffect(() => {
    import(`./scenes/${SCENE_NAME}`)
      .then((module: { default: SceneConstructor }) => {
        setMainScene(() => module.default);
      });
  }, []);

  React.useEffect(() => {
    if (!MainScene) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scene: Scene = new MainScene(canvas, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, utils);

    const loop = (time: number) => {
      const frame = buildFrame({
        timeElapsedMs: time % TOTAL_TIME_MS,
      }, info);
      scene.draw(frame, info);
      clock = requestAnimationFrame(loop);

      const range = rangeRef.current;
      if (range) range.valueAsNumber = frame.progress;
    };
    let clock = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(clock);
  }, [MainScene]);

  return (
    <div className="App">
      <h1>Scene</h1>
      <p><a href={`${SCENE_NAME}.mp4`}>Latest render</a></p>
      <p>
        <input
          ref={rangeRef}
          type="range"
          min={0}
          max={1}
          readOnly={true}
          disabled={true}
          step={0.01}
          defaultValue={0}
          style={{ width: CANVAS_WIDTH }}
        />
      </p>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

export default App;
