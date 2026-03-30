import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateImage9by16 = (
  file: File,
  tolerance = 0.05
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const ratio = img.width / img.height;
      URL.revokeObjectURL(url);

      const targetRatio = 9 / 16;
      resolve(Math.abs(ratio - targetRatio) <= tolerance);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
};



export const resizeTo9by16Contain = (
  file: File,
  targetHeight: number
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');

      const targetWidth = Math.round(targetHeight * 9 / 16);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d')!;

      // white background (important for jpg)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(
        targetWidth / img.width,
        targetHeight / img.height
      );

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const dx = (targetWidth - drawWidth) / 2;
      const dy = (targetHeight - drawHeight) / 2;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(new File([blob!], file.name, { type: file.type }));
      }, file.type);
    };

  });
};

export const resizeTo9by16Cover = (
  file: File,
  targetHeight: number
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');

      const targetWidth = Math.round(targetHeight * 9 / 16);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d')!;

      // NO white background needed for cover
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // COVER logic: max scale to fill both dims
      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      // Center crop
      const dx = (targetWidth - drawWidth) / 2;
      const dy = (targetHeight - drawHeight) / 2;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(new File([blob!], file.name, { type: file.type }));
      }, file.type);
    };

    img.src = url;
  });
};



/**
 * Generic file validation helper for RHF + Redux backed uploads
 */
export function validateFileField(
  params: {
    rhfValue: unknown;
    backendValue?: string | null;
    removed?: boolean;
    errorMessage: string;
  }
) {
  const { rhfValue, backendValue, removed, errorMessage } = params;

  // If user explicitly removed → invalid
  if (removed) return errorMessage;

  // New file selected
  if (rhfValue instanceof File) return true;

  // Existing backend file
  if (backendValue) return true;

  // Otherwise invalid
  return errorMessage;
}


