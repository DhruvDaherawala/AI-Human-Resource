import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <Button asChild>
          <Link href="/jobs/new">Post New Job</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Sample Job Cards */}
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Senior Software Engineer</h2>
              <p className="text-muted-foreground">Full-time • Remote</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Looking for an experienced software engineer to join our team...
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">React</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Node.js</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">TypeScript</span>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Product Manager</h2>
              <p className="text-muted-foreground">Full-time • Hybrid</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Seeking a Product Manager to drive product strategy and execution...
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Product Strategy</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Agile</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">User Research</span>
          </div>
        </div>
      </div>
    </div>
  )
} 