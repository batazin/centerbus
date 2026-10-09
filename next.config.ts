import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
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
