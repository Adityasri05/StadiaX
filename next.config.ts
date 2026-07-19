import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Enable asset compression for optimal network transfers
  compress: true,
  // Strict mode for detecting rendering inefficiencies
  reactStrictMode: true,
};

export default nextConfig;
