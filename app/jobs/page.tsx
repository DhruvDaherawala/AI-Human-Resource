import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Jobs - AI HR System",
  description: "Manage your job listings and requirements",
}

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button asChild>
          <Link href="/jobs/new">Post New Job</Link>
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Job Card 1 */}
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Senior Software Engineer</h2>
              <p className="text-muted-foreground mt-1">Full-time • Remote</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">React</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">TypeScript</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">Node.js</span>
          </div>
        </div>

        {/* Job Card 2 */}
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Product Manager</h2>
              <p className="text-muted-foreground mt-1">Full-time • Hybrid</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">Product Strategy</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">Agile</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">User Research</span>
          </div>
        </div>
      </div>
    </div>
  )
} 