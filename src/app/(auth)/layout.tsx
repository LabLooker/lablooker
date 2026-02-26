import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-[#1a2e2b]">
        {APP_CONFIG.name}
      </Link>
      {children}
    </div>
  )
}
