import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { APP_CONFIG } from '@/config/app'
import './globals.css'

const siteUrl = 'https://lablooker.com'

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: APP_CONFIG.name,
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="impact-site-verification" content="e7afc7ad-ba19-4c19-aea0-26396285df37" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
