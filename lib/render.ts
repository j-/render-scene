import fs, { createWriteStream } from 'fs';
import path from 'path';
import { createCanvas, Canvas } from 'canvas';
import { Scene, SceneConstructor } from '../src/scene';
import { Utils } from '../src/utils';
import { buildInfo } from '../src/info';
import { buildFrame } from '../src/frame';

const sceneName = process.argv[2];
const scenePath = path.resolve(__dirname, '..', 'src', 'scenes', sceneName + '.ts');

const outDir = path.resolve(__dirname, '..', 'out', sceneName);

const WIDTH = 500;
const HEIGHT = 500;

const TOTAL_TIME_MS = 30000;
const FRAMES_PER_SECOND = 30;

const info = buildInfo({
  totalTimeMs: TOTAL_TIME_MS,
  framesPerSecond: FRAMES_PER_SECOND,
});

try {
  fs.statSync(scenePath);
  console.error(`Scene with name "${sceneName}" found at path "${scenePath}"`);
} catch (err) {
  console.error(`Could not find scene with name "${sceneName}" at path "${scenePath}"`);
  process.exit(1);
}

// try {
//   fs.mkdirSync(outDir, { recursive: true });
//   console.error(`Writing to "${outDir}"`);
// } catch (err) {
//   console.error(`Could not create output directory: ${err.message}`);
//   process.exit(1);
// }

(async () => {
  let SceneConstructor: SceneConstructor;

  try {
    SceneConstructor = (await import(scenePath)).default;
  } catch (err) {
    console.error(`Error importing scene: ${err.message}`);
    process.exit(1);
  }

  let canvas: Canvas;
  let scene: Scene;

  try {
    canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const utils: Utils = {
      createCanvas(width, height) {
        return (createCanvas(width, height) as unknown) as HTMLCanvasElement;
      },
    };
    scene = new SceneConstructor((canvas as unknown) as HTMLCanvasElement, ctx, WIDTH, HEIGHT, utils);
  } catch (err) {
    console.error(`Error constructing scene: ${err.message}`);
    process.exit(1);
  }

  console.log(`Rendering ${info.totalFrames} frames`);

  const order = Math.ceil(Math.log10(info.totalFrames));

  for (let i = 0; i < info.totalFrames; i++) {
    const frame = buildFrame({
      framesElapsed: i,
    }, info);
    scene.draw(frame, info);
    try {
      await new Promise((resolve, reject) => {
        const fileName = `frame-${i.toString().padStart(order, '0')}.png`;
        const outPath = path.resolve(outDir, fileName);
        const out = createWriteStream(outPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('close', resolve);
        out.on('error', reject);
      });
    } catch (err) {
      console.error(`Error rendering frame ${i}: ${err.message}`);
      process.exit(1);
    }
  }

})();
