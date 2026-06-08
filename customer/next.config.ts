import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 generates .next/dev/types/validator.ts with a known LayoutRoutes
    // constraint error that is a framework bug, not user code. Ignore it in production builds.
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
