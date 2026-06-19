import { uploadThumbnailAction } from "@/features/courses/server-action";
import { useState } from "react";
import { toast } from "sonner";

export function useUploadThumbnail() {
  const [isUploading, setIsUploading] = useState(false);
  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadThumbnailAction(formData);
      if (!result.success || !result.url) {
        toast.error(result.error || "Failed to upload thumbnail");
        return null;
      }
      return result.url;
    } catch {
      toast.error("Failed to upload thumbnail");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
