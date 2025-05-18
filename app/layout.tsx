import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI HR System',
  description: 'AI-powered Human Resource Management System',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
              <Link href="/" className="text-lg font-semibold">
                AI Resume Screening
              </Link>
              <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/jobs" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Jobs
                </Link>
                <Link 
                  href="/candidates" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Candidates
                </Link>
                <Link 
                  href="/settings" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by AI HR Team. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                  Privacy
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 