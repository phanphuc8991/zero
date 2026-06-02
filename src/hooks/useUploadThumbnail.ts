import { uploadThumbnailService } from "@/features/courses/services";
import { useState } from "react";
import { toast } from "sonner";

export function useUploadThumbnail() {
  const [isUploading, setIsUploading] = useState(false);
  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const data = await uploadThumbnailService(file);
      return data.url;
    } catch {
      toast.error("Failed to upload thumbnail");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
