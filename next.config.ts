// cache-bust: force fresh build after stale chunk corruption
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
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
