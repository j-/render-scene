export const loadFileAsBlob = async (src: string): Promise<Blob> => {
  const res = await fetch(src);
  const blob = await res.blob();
  return blob;
};

export const loadFile = async (src: string): Promise<ArrayBuffer> => {
  const blob = await loadFileAsBlob(src);
  const buf = blob.arrayBuffer();
  return buf;
};
