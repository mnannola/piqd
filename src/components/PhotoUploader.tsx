import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { prepareImage } from "../lib/imageUtils";

export interface UploadedPhoto {
  id: string;
  file: File;
  base64: string;
  previewUrl: string;
  name: string;
}

interface PhotoUploaderProps {
  onPhotosLoaded: (photos: UploadedPhoto[]) => void;
  disabled?: boolean;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_PHOTOS = 75;

export default function PhotoUploader({ onPhotosLoaded, disabled }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList | File[]) {
    setError(null);
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((f) => ACCEPTED_TYPES.includes(f.type));

    if (validFiles.length === 0) {
      setError("No valid image files found. Please upload JPG, PNG, or WebP files.");
      return;
    }
    if (validFiles.length > MAX_PHOTOS) {
      setError(`Maximum ${MAX_PHOTOS} photos allowed. ${validFiles.length} were selected.`);
      return;
    }

    setIsProcessing(true);
    try {
      const photos: UploadedPhoto[] = await Promise.all(
        validFiles.map(async (file) => {
          const base64 = await prepareImage(file);
          const previewUrl = URL.createObjectURL(file);
          return { id: generateId(), file, base64, previewUrl, name: file.name };
        })
      );
      onPhotosLoaded(photos);
    } catch {
      setError("Failed to process some photos. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isDragging
          ? "border-violet-500 bg-violet-50"
          : "border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50/50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">⏳</span>
          <p className="text-gray-500 text-sm">Processing photos...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">📷</span>
          <p className="font-semibold text-gray-800 text-base">
            Drop your listing photos here
          </p>
          <p className="text-gray-500 text-sm">
            or click to browse — JPG, PNG, WebP up to {MAX_PHOTOS} photos
          </p>
          <button className="mt-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            Select Photos
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
