import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Normally ".next". A project kept in a cloud-synced folder (iCloud Desktop,
  // OneDrive) should set NEXT_DIST_DIR=".next.nosync" in .env: sync clients
  // duplicate files inside the build folder, which breaks the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Do not announce what the site is built with.
  poweredByHeader: false,
  // Development only: other devices allowed to load the dev server, so the site
  // can be tried on a phone on the same Wi-Fi. Set DEV_ALLOWED_ORIGINS in .env
  // to a comma-separated list of hostnames, for example "192.168.*.*,*.local".
  allowedDevOrigins: (process.env.DEV_ALLOWED_ORIGINS ?? "").split(",").map((host) => host.trim()).filter(Boolean),
  // The judge runs as a separate Node process that loads these files from disk,
  // so they must ship with the server even though nothing imports them.
  outputFileTracingIncludes: {
    "/**": ["./judge/**", "./public/judge/**", "./node_modules/pyodide/**"],
  },
  // Sent with every page: never shown inside another site's frame, no guessing
  // at file types, addresses not leaked to other sites, no camera, microphone
  // or location, and (on the live site) HTTPS only.
  async headers() {
    const headers = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ];
    if (process.env.NODE_ENV === "production") headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
