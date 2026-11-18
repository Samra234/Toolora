export interface LoadedImage {
  img: HTMLImageElement;
  width: number;
  height: number;
  objectUrl: string;
}

export function loadImageFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not a supported image format.'));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        objectUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not decode image file. Please try a valid JPG, PNG, or WebP image.'));
    };
    img.src = objectUrl;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Browser could not encode the target image format.'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

export function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx > 0 ? filename.slice(0, idx) : filename;
}
