import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Normally ".next". A project kept in a cloud-synced folder (iCloud Desktop,
  // OneDrive) should set NEXT_DIST_DIR=".next.nosync" in .env: sync clients
  // duplicate files inside the build folder, which breaks the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // The judge runs as a separate Node process that loads these files from disk,
  // so they must ship with the server even though nothing imports them.
  outputFileTracingIncludes: {
    "/**": ["./judge/**", "./public/judge/**", "./node_modules/pyodide/**"],
  },
};

export default nextConfig;
