// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Resolve '@' alias to the 'src' directory
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: ['storage.googleapis.com'],  // Allow images from this domain
  },
};

export default nextConfig;
