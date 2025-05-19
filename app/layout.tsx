'use client'

import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Toaster } from 'react-hot-toast'
import smoothscroll from 'smoothscroll-polyfill'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    // Initialize smooth scroll polyfill
    smoothscroll.polyfill()
    
    // Remove the cz-shortcut-listen attribute after hydration
    document.body.removeAttribute('cz-shortcut-listen')
  }, [])

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 2000,
                style: {
                  background: '#4aed88',
                  color: '#fff',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#ff4b4b',
                  color: '#fff',
                },
              },
            }}
          />
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 font-semibold tracking-tight smooth-scroll"
                  >
                    AI Resume Screening
                  </Link>
                  <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors smooth-scroll">
                      Dashboard
                    </Link>
                    <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors smooth-scroll">
                      Jobs
                    </Link>
                    <Link href="/candidates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors smooth-scroll">
                      Candidates
                    </Link>
                    <Link href="/resume" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors smooth-scroll">
                      Resume
                    </Link>
                    <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors smooth-scroll">
                      Settings
                    </Link>
                    <ModeToggle />
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {children}
              </div>
            </main>
            <footer className="border-t py-3 md:py-4">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-3 md:h-16 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by AI HR Team. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Terms
                    </Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Privacy
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 