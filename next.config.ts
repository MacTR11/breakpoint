import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Normally ".next". A project kept in a cloud-synced folder (iCloud Desktop,
  // OneDrive) should set NEXT_DIST_DIR=".next.nosync" in .env: sync clients
  // duplicate files inside the build folder, which breaks the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Development only: other devices allowed to load the dev server, so the site
  // can be tried on a phone on the same Wi-Fi. Set DEV_ALLOWED_ORIGINS in .env
  // to a comma-separated list of hostnames, for example "192.168.*.*,*.local".
  allowedDevOrigins: (process.env.DEV_ALLOWED_ORIGINS ?? "").split(",").map((host) => host.trim()).filter(Boolean),
  // The judge runs as a separate Node process that loads these files from disk,
  // so they must ship with the server even though nothing imports them.
  outputFileTracingIncludes: {
    "/**": ["./judge/**", "./public/judge/**", "./node_modules/pyodide/**"],
  },
};

export default nextConfig;
