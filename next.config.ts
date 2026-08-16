import type { NextConfig } from "next";

const tunnelHostname = process.env.CLOUDFLARE_HOSTNAME;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
      ...(tunnelHostname ? { allowedOrigins: [tunnelHostname] } : {}),
    },
  },
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
