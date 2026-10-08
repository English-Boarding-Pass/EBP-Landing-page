import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Baseline security headers on every response. HTTPS enforcement (HSTS)
  // is added by Vercel itself.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Browsers must not guess a file's type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Other sites can't embed ours in a frame (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Outbound links reveal our domain, never the full page address.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site uses none of these device features.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
