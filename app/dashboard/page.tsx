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
    <div className="container px-4 md:px-6 py-6 md:py-10">
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
  )
}
