import type { NextConfig } from "next";

// Hostinger reports many CPUs but a low thread limit. Prisma's Tokio runtime
// then fails with "OS can't spawn worker thread" (os error 11) during `next build`.
process.env.TOKIO_WORKER_THREADS ??= "1";
process.env.RAYON_NUM_THREADS ??= "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    cpus: 1,
    workerThreads: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
