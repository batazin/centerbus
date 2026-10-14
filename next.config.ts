import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Portable private Sites preview; the existing deployment keeps its normal build.
  output: process.env.CENTER_STATIC_EXPORT === "1" ? "export" : undefined,
  images: { unoptimized: process.env.CENTER_STATIC_EXPORT === "1" },
  outputFileTracingRoot: path.resolve(process.cwd()),
  allowedDevOrigins: ["192.168.18.219"],
  webpack(config) {
    config.module.rules.push({
      test: /\.wgsl$/,
      use: [
        {
          loader: "@vgpu/wgsl/loader-webpack",
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
