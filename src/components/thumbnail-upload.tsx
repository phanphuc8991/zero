"use client";

import { useRef, useState, useEffect } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import cloudinaryLoader from "@/lib/utils";

interface ThumbnailUploadProps {
  value?: string | null;
  onChange: (file: File | null) => void;
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setError(null);

    const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type,
    );
    if (!isValidType) {
      setError("Only PNG, JPG, or WEBP files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleRemove = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border group aspect-video bg-muted/50 w-full">
          {preview.startsWith("blob:") ? (
            <img
              src={preview}
              alt="Course thumbnail preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center text-xs text-muted-foreground">
                  Loading image...
                </div>
              )}

              <Image
                src={preview}
                alt="Course thumbnail preview"
                width={600}
                height={340}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                loader={cloudinaryLoader}
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            </>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2 cursor-pointer"
              disabled={isImageLoading}
              onClick={() => inputRef.current?.click()}
            >
              <ImageIcon size={14} /> Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={handleRemove}
              disabled={isImageLoading}
            >
              <X size={14} /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border border-dashed rounded-lg p-8 text-center cursor-pointer transition
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:bg-accent/40 bg-background"}`}
        >
          <div className="mx-auto h-10 w-10 rounded-full bg-background flex items-center justify-center border shadow-sm mb-3">
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium block mb-1">
            Drop your course banner here
          </span>
          <span className="text-xs text-muted-foreground block mb-3">
            PNG, JPG or WEBP (max. 5MB)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Select image
          </Button>
        </div>
      )}

      {error && (
        <p
          aria-live="polite"
          role="alert"
          className="text-destructive text-xs mt-2"
        >
          {error}
        </p>
      )}
    </div>
  );
}
