import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentUploads } from "@/components/recent-uploads"
import { JobsList } from "@/components/jobs-list"
import { TopCandidates } from "@/components/top-candidates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Briefcase, FileText, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard - AI HR System",
  description: "Overview of your HR system",
}

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Monitor your resume screening process and candidate shortlisting.
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href="/upload">Upload Resumes</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2</span> new positions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-500">+23%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+3</span> this month
              </p>
            </CardContent>
          </Card>
        </div>

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

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Senior Developer</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/30 text-yellow-700">In Review</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Jane Smith</p>
                  <p className="text-xs text-muted-foreground">Product Manager</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-400/30 text-green-700">Hired</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Alice Johnson</p>
                  <p className="text-xs text-muted-foreground">Frontend Developer</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-400/30 text-blue-700">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Bob Wilson</p>
                  <p className="text-xs text-muted-foreground">UX Designer</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-400/30 text-blue-700">Next Week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
