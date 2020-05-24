export const createImageData = (
  ctx: CanvasRenderingContext2D,
  width = ctx.canvas.width,
  height = ctx.canvas.height,
): ImageData => ctx.createImageData(width, height);
