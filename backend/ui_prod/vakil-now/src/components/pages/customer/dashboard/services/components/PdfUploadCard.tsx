import { Button } from '@/components/ui/button';
import { Download, Eye, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

/* ===================== TYPES ===================== */

export interface EsignDocument {
  fileName: string;
  signedUrl?: string;
}

interface PdfUploadCardInterface {
  description: string;
  onFileSelect?: (file: File) => void;
  initialFile?: File | string | EsignDocument | null;
}

/* ===================== COMPONENT ===================== */

export default function PdfUploadCard({
  description,
  onFileSelect,
  initialFile
}: PdfUploadCardInterface) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<
    File | string | EsignDocument | null
  >(null);

  /* ===================== SYNC FROM PARENT ===================== */
  useEffect(() => {
    setSelectedFile(initialFile ?? null);
  }, [initialFile]);

  /* ===================== FILE PICKER ===================== */
  const openPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  /* ===================== HELPERS ===================== */

  const getFileName = (file: File | string | EsignDocument) => {
    if (file instanceof File) return file.name;
    if (typeof file === 'string')
      return file.split('/').pop() || 'document.pdf';
    return file.fileName;
  };

  const getPreviewUrl = () => {
    if (!selectedFile) return null;

    if (selectedFile instanceof File) {
      return URL.createObjectURL(selectedFile);
    }

    if (typeof selectedFile === 'string') {
      return selectedFile;
    }

    return selectedFile.signedUrl;
  };

  const openPreview = () => {
    const url = getPreviewUrl();
    if (!url) return;

    window.open(url, '_blank');

    if (selectedFile instanceof File) {
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  const downloadFile = () => {
    const url = getPreviewUrl();
    if (!url || !selectedFile) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName(selectedFile);
    a.click();

    if (selectedFile instanceof File) {
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className='border-[#4FC3F7] border rounded p-5'>
      <div className='flex gap-5'>
        <Image src='/pdfIcon.png' alt='PDF icon' width={53} height={53} />

        <div className='flex flex-col'>
          <h2 className='text-[#737373] font-semibold text-[16px]'>Document</h2>
          <p className='text-[14px] text-[#4FC3F7]'>{description}</p>

          {selectedFile && (
            <span className='text-[#595959] text-[14px] mt-1'>
              {getFileName(selectedFile)}
            </span>
          )}
        </div>
      </div>

      {/* hidden input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='application/pdf'
        hidden
        onChange={handleFileChange}
      />

      <div className='flex justify-end gap-2 mt-3'>
        {/* Upload */}
        <Button
          type='button'
          variant='link'
          size='icon'
          className='bg-[#E8E8E8] p-2 rounded'
          onClick={openPicker}>
          <Upload color='#595959' />
        </Button>

        {/* View */}
        <Button
          type='button'
          variant='link'
          size='icon'
          className='bg-[#1565C0] p-2 rounded'
          disabled={!selectedFile}
          onClick={openPreview}>
          <Eye color='#FFFFFF' />
        </Button>

        {/* Download */}
        <Button
          type='button'
          variant='link'
          size='icon'
          className='bg-[#1565C0] p-2 rounded'
          disabled={!selectedFile}
          onClick={downloadFile}>
          <Download color='#FFFFFF' />
        </Button>
      </div>
    </div>
  );
}
