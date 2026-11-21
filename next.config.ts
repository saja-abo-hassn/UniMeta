import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable Next.js dev indicator floating overlay */
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { cpus: 2 },
};

export default nextConfig;
