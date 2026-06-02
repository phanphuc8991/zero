import cloudinary from "@/lib/cloudinary";
import { apiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return apiResponse.error("NO_FILE", 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "courses/thumbnails" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return apiResponse.success({ url: (result as any).secure_url }, 200);
  } catch (error) {
    console.error("Upload error:", error);
    return apiResponse.error("UPLOAD_FAILED", 500);
  }
}
