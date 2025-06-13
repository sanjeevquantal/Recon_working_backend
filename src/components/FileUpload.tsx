
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle2, PlusCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
}

const FileUpload = ({ label, onFileChange, accept = ".xlsx,.xls,.csv" }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileChange(droppedFile);
      setIsDraggingOver(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">{label}</div>
      <div
        className={`border-2 border-dashed rounded-md p-4 transition-colors backdrop-blur-sm ${
          isDraggingOver ? 'border-primary bg-primary/10' : 'border-white/20'
        } ${file ? 'border-success bg-success/10' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-center py-4">
            <CheckCircle2 className="h-6 w-6 text-success mr-2" />
            <span className="font-medium truncate max-w-[250px]">{file.name}</span>
          </div>
        ) : (
          <>
            <input
              type="file"
              id={inputId}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
            <label htmlFor={inputId} className="cursor-pointer block">
              <div className="flex flex-col items-center py-4">
                <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500">Excel or CSV file</p>
              </div>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
