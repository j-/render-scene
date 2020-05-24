export const getContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');
  if (ctx === null) throw new Error('Could not get 2D rendering context from canvas');
  return ctx;
};
