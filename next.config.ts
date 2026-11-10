import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Portable private Sites preview; the existing deployment keeps its normal build.
  output: process.env.CENTER_STATIC_EXPORT === "1" ? "export" : undefined,
  images: { unoptimized: process.env.CENTER_STATIC_EXPORT === "1" },
  outputFileTracingRoot: path.resolve(process.cwd()),
  allowedDevOrigins: ["192.168.18.219"],
  async redirects() {
    return [
      { source: "/troca-de-parabrisa/:path*", destination: "/troca-e-instalacao-de-vidros/:path*", permanent: true },
      { source: "/home-2", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ...(process.env.CENTER_SITE_INDEXABLE === "0" || ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT || "")
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
    ] }];
  },
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
