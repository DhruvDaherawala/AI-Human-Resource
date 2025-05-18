import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'AI HR System',
  description: 'AI-powered Human Resource Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <div className="relative flex min-h-screen flex-col">
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
                © 2024 AI Resume Screening. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
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