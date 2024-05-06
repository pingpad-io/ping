import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "*.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  transpilePackages: ['@lens-protocol'],

  typescript: {
    ignoreBuildErrors: true,
  },

};

// export default bundleAnalyzer(config);
export default config;
