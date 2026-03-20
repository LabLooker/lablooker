import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  async headers() {
    return [
      {
        // Prevent edge caching of HTML pages — static assets are still cached via _next/static
        source: '/((?!_next/static|_next/image|favicon|.*\\..*).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/guides/:slug*',
        destination: '/topics/:slug*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
