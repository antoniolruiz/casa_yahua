/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // enable static HTML export for GitHub Pages
  output: 'export',
  basePath: process.env.NEXT_BASE_PATH || '',
  assetPrefix: process.env.NEXT_ASSET_PREFIX || (process.env.NEXT_BASE_PATH ? process.env.NEXT_BASE_PATH + '/' : ''),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'a0.muscache.com' },
      { protocol: 'https', hostname: 'a1.muscache.com' },
      { protocol: 'https', hostname: 'a2.muscache.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' }
    ]
  }
}

export default nextConfig


