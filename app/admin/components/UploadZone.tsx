"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";

export interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
}

export default function UploadZone({
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  label = "Choose image",
  description = "Drag and drop, or click to browse from your device",
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected(event.target.files);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
        isDraggingOver
          ? "border-primary bg-accent/40"
          : "border-border/40 bg-background hover:border-primary/60"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
        <UploadCloud className="h-5 w-5" />
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="btn-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <UploadCloud className="h-4 w-4" />
        {label}
      </button>
    </div>
  );
}