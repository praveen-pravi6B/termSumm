
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   experimental: {
    serverActions: {
        allowedOrigins: ["localhost:9002"], // Add your deployment domain here as well
        // You might need bodySizeLimit if dealing with large file uploads via actions
        // bodySizeLimit: '5mb',
    },
   },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
