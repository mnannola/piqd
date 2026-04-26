const COMPRESS_IMAGES = import.meta.env.VITE_COMPRESS_IMAGES === "true";
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;

export async function prepareImage(file: File): Promise<string> {
  if (!COMPRESS_IMAGES) {
    return readAsBase64(file);
  }
  return compressImage(file);
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate new dimensions keeping aspect ratio
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      // If already small enough, skip compression entirely
      if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION) {
        readAsBase64(file).then(resolve).catch(reject);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve(dataUrl.split(",")[1]);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}

export function isCompressionEnabled(): boolean {
  return COMPRESS_IMAGES;
}
