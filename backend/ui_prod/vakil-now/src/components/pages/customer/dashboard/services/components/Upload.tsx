
import { cn, resizeTo9by16Cover } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface UploadProp {
  heading: string;
  description: React.ReactNode;
  value?: File | string | null;
  onChange?: (file: File | null) => void; // ✅ allow null
  onRemove?: () => void;
  error?: string;
  enforce9by16?: boolean;
  targetWidth?: number;
  accept?: string;
  headingClassName?:string;
  uploadNameClassName?:string
}



export default function UploadContainer({
  heading,
  description,
  value,
  onChange,
  onRemove,
  error,
  enforce9by16,
  targetWidth = 400,
  accept,
  headingClassName,
  uploadNameClassName
}: UploadProp) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);


  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      setIsPdf(false);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setIsPdf(value.type === 'application/pdf');
      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(value);
    setIsPdf(value.toLowerCase().includes('.pdf'));


  }, [value]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  // const handleRemove = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // 🚫 prevent opening file picker
  //   setPreviewUrl(null);
  //   setIsPdf(false);
  //   onChange?.(null);

  //   if (inputRef.current) {
  //     inputRef.current.value = ''; // ✅ reset input
  //   }
  // };


  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    setPreviewUrl(null);
    setIsPdf(false);

    onChange?.(null);
    onRemove?.(); // ✅ IMPORTANT

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className={cn("font-semibold text-md text-[#737373]", headingClassName)}>{heading}</h2>

      <div
        onClick={openFilePicker}
        aria-invalid={!!error}
        className={cn(
          ' relative rounded border-[1.5px] border-dashed p-4 cursor-pointer',
          'h-[108px] md:h-[180px] flex items-center justify-center', // ✅ Fixed height prevents shift
          error ? 'border-red-500' : 'border-[#4FC3F7]'
        )}
      >

        {/* ❌ REMOVE ICON */}
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 rounded-full bg-white p-1 shadow hover:bg-gray-100"
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}

        {/* PREVIEW */}
        {previewUrl ? (
          isPdf ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-sm text-gray-600">PDF uploaded</span>

              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1565C0] underline text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                View PDF
              </a>

              <span className="text-xs text-gray-500">Click to replace</span>
            </div>
          ) : (
            <div
              className={cn(
                "overflow-hidden flex items-center justify-center rounded",
                enforce9by16
                  ? "h-full aspect-[9/16]" // ✅ 9:16 ratio, fits parent height
                  : "w-full h-full"        // ✅ Fills parent height
              )}
            >

              <img
                src={previewUrl}
                className={cn(
                  "w-full h-full",
                  enforce9by16
                    ? "object-cover"   // ✅ Crop for 9:16
                    : "object-contain" // ✅ Fit for others
                )}
              />
            </div>
          )
        )


          : (
            <div className="flex flex-col items-center md:gap-2 text-center">
              <Upload color="#1565C0" />
              <span className={cn("text-[#1565C0] text-sm font-medium",uploadNameClassName)}>Upload</span>
              <div className="text-red-500 text-sm leading-snug max-w-[240px]">
                {description}
              </div>
            </div>
          )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {localError && <p className="text-sm text-red-500">{localError}</p>}

      <input
        ref={inputRef}
        type='file'
        className='hidden'
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setLocalError(null);

          if (file.type === 'application/pdf') {
            onChange?.(file);
            return;
          }

          if (enforce9by16) {
            const resizedFile = await resizeTo9by16Cover(file, 400); // ✅ NOW COVER (Crop)
            onChange?.(resizedFile);
            return;
          }

          onChange?.(file);
        }}
      />
    </div>
  );
}
