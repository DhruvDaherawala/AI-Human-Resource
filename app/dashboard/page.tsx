import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentUploads } from "@/components/recent-uploads"
import { JobsList } from "@/components/jobs-list"
import { TopCandidates } from "@/components/top-candidates"

export const metadata: Metadata = {
  title: "Dashboard | AI Resume Screening",
  description: "HR dashboard for resume screening and candidate shortlisting",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-lg font-semibold">AI Resume Screening</h1>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/jobs" className="text-sm font-medium hover:underline underline-offset-4">
              Jobs
            </Link>
            <Link href="/candidates" className="text-sm font-medium hover:underline underline-offset-4">
              Candidates
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:underline underline-offset-4">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                  Monitor your resume screening process and candidate shortlisting.
                </p>
              </div>
              <Button asChild>
                <Link href="/upload">Upload Resumes</Link>
              </Button>
            </div>

            <DashboardStats />

            <Tabs defaultValue="recent" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
                <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
                <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="space-y-4">
                <RecentUploads />
              </TabsContent>
              <TabsContent value="jobs" className="space-y-4">
                <JobsList />
              </TabsContent>
              <TabsContent value="candidates" className="space-y-4">
                <TopCandidates />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
