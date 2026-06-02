import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.includes("res.cloudinary.com")) {
    return src.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width}/`,
    );
  }
  return src;
}
export function getCloudinaryBlurUrl(src: string) {
  if (src.includes("res.cloudinary.com")) {
    return src.replace(
      "/image/upload/",
      `/image/upload/f_auto,w_20,q_1,bl_100/`,
    );
  }
  return src;
}
