import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep type checking enabled through the compiler API; the CLI subprocess
  // cannot return its config reliably in this workspace.
  experimental: { useTypeScriptCli: false },
  // The interface uses standard CSS, which Turbopack compiles natively.
};

export default nextConfig;
