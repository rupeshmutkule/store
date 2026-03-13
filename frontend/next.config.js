/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/store',
  assetPrefix: '/store',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icmedianew.gumlet.io',
      },
      {
        protocol: 'https',
        hostname: 'okcredit-blog-images-prod.storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.oceancowboy.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/store',
        permanent: true,
        basePath: false,
      }
    ];
  }
};

module.exports = nextConfig;