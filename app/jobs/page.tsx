import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Jobs - AI HR System",
  description: "Manage your job listings and requirements",
}

export default function JobsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <Button asChild variant="default" size="sm">
          <Link href="/jobs/new">Post New Job</Link>
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Job Card 1 */}
        <div className="border rounded-lg p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Senior Software Engineer</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Full-time • Remote</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-400/30 text-green-700">Active</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">React</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">TypeScript</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">Node.js</span>
          </div>
        </div>

        {/* Job Card 2 */}
        <div className="border rounded-lg p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Product Manager</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Full-time • Hybrid</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/30 text-yellow-700">Draft</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">Product Strategy</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">Agile</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm backdrop-blur-sm">User Research</span>
          </div>
        </div>
      </div>
    </div>
  )
} 