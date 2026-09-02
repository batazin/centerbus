import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
