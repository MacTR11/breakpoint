import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The judge runs as a separate Node process that loads these files from disk,
  // so they must ship with the server even though nothing imports them.
  outputFileTracingIncludes: {
    "/**": ["./judge/**", "./public/judge/**", "./node_modules/pyodide/**"],
  },
};

export default nextConfig;
