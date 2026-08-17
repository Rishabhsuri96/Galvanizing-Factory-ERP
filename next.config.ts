// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["tesseract.js", "tesseract.js-core"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // raise to whatever covers your largest challan scans
    },
  },
};

export default nextConfig;