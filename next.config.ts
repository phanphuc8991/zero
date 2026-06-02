import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.53"],
  reactStrictMode: false,
};

export default nextConfig;
