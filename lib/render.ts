import { existsSync, createWriteStream } from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import logUpdate from 'log-update';
import { createCanvas, loadImage, Canvas } from 'canvas';
import { Scene, SceneConstructor } from '../src/scene';
import { Utils } from '../src/utils';
import { buildInfo } from '../src/info';
import { buildFrame } from '../src/frame';
import config from '../src/config.json';

const sceneName = config.name;
const scenePath = path.resolve(__dirname, '..', 'src', 'scenes', sceneName);

const outDir = path.resolve(__dirname, '..', 'out', sceneName);

const WIDTH = config.render.width;
const HEIGHT = config.render.height;

const TOTAL_TIME_MS = config.common.time;
const FRAMES_PER_SECOND = config.common.fps;

const info = buildInfo({
  totalTimeMs: TOTAL_TIME_MS,
  framesPerSecond: FRAMES_PER_SECOND,
});

const scenePathOptions = [
  scenePath + '.ts',
  path.join(scenePath, '/index.ts'),
];

const scenePathFull = scenePathOptions.find((scenePathFull) => {
  logUpdate(`Checking if module exists: "${scenePathFull}"`);
  const exists = existsSync(scenePathFull);
  if (exists) {
    logUpdate(`Checking if module exists: "${scenePathFull}" - Exists`);
  }
  logUpdate.done();
  return exists;
});

if (!scenePathFull) {
  console.error('Cannot find scene. Check that it exists and try again.');
  process.exit(1);
}

try {
  mkdirp.sync(outDir);
  console.error(`Writing to "${outDir}"`);
} catch (err) {
  console.error(`Could not create output directory: ${err.message}`);
  process.exit(1);
}

(async () => {
  let SceneConstructor: SceneConstructor;

  try {
    console.debug('Importing scene');
    SceneConstructor = (await import(scenePathFull)).default;
  } catch (err) {
    console.error(`Error importing scene: ${err.message}`);
    process.exit(1);
  }

  let canvas: Canvas;
  let scene: Scene;

  try {
    console.debug('Creating canvas');
    canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d', {
      alpha: false,
    });
    const utils: Utils = {
      createCanvas: (createCanvas as unknown) as Utils['createCanvas'],
      loadImage: (loadImage as unknown) as Utils['loadImage'],
    };
    console.debug('Constructing scene');
    scene = new SceneConstructor((canvas as unknown) as HTMLCanvasElement, ctx, WIDTH, HEIGHT, utils);
    console.debug('Setting up scene');
    await scene.setup();
  } catch (err) {
    console.error(`Error constructing scene: ${err.message}`);
    process.exit(1);
  }

  console.log(`Rendering ${info.totalFrames} frames`);

  // Always 5 i.e. 00000 to 99999
  const order = 5;

  for (let i = 0; i < info.totalFrames; i++) {
    if (i % info.framesPerSecond === 0) {
      const seconds = i / info.framesPerSecond;
      const progress = Math.round(i / info.totalFrames * 100);
      logUpdate(`Rendering frame ${i} (${seconds}s, ${progress}%)`);
    }
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

  logUpdate('Done');

})();
