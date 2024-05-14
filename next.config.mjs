import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@lens-protocol', 'lucide-react'],

  typescript: {
    ignoreBuildErrors: true,
  },

};

// export default bundleAnalyzer(config);
export default config;
