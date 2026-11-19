import type { NextConfig } from "next";

const apiOrigin = (process.env.BHRIGUSETU_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://bhrigusetu-api.onrender.com").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
