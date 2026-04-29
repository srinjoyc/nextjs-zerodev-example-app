/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@farcaster/mini-app-solana"] = false;
    return config;
  },
};

export default nextConfig;
