import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function JobsList() {
  // Mock data - in a real app, this would come from your database
  const jobs = [
    {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      postedDate: "2025-05-10T00:00:00Z",
      applicants: 24,
      shortlisted: 8,
      status: "Active",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      postedDate: "2025-05-08T00:00:00Z",
      applicants: 18,
      shortlisted: 5,
      status: "Active",
    },
    {
      id: "3",
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      postedDate: "2025-05-05T00:00:00Z",
      applicants: 32,
      shortlisted: 10,
      status: "Active",
    },
    {
      id: "4",
      title: "Data Scientist",
      department: "Data",
      location: "Remote",
      postedDate: "2025-05-01T00:00:00Z",
      applicants: 15,
      shortlisted: 6,
      status: "Active",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Jobs</h3>
        <Button asChild>
          <Link href="/jobs/new">Create New Job</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.department} • {job.location}
                  </CardDescription>
                </div>
                <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Posted</p>
                  <p>{formatDate(job.postedDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Applicants</p>
                  <p>{job.applicants}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shortlisted</p>
                  <p>{job.shortlisted}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Match Rate</p>
                  <p>{Math.round((job.shortlisted / job.applicants) * 100)}%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/jobs/${job.id}/candidates`}>View Candidates</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href="/jobs">View All Jobs</Link>
        </Button>
      </div>
    </div>
  )
}
