import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 — no webpack polyfills needed,
  // Turbopack handles Node.js module resolution automatically.
  turbopack: {},
};

export default nextConfig;
