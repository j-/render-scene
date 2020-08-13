export const loadImage = async (src: string) => {
  const image = new Image();
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = src;
  });
};
