import Link from 'next/link'

export default function JobsLayout({ children }) {
  return (
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
    </div>
  )
} 