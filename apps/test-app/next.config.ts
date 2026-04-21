import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@link-preview/ui', '@link-preview/core'],
};

export default nextConfig;
