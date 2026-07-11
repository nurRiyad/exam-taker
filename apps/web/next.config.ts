import type { NextConfig } from "next";

// Proxies /api/* to the local Hono Worker dev server so the browser sees
// same-origin requests in dev too, matching production's same-site
// apex/api.<domain> cookie setup (ADR-0060). Production routing between the
// two Cloudflare deployments is handled by DNS/Worker routes, not this file.
const API_DEV_ORIGIN = process.env.API_DEV_ORIGIN ?? "http://localhost:8787";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_DEV_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
