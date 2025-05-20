import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye } from "lucide-react"

export function RecentUploads() {
  // Mock data - in a real app, this would come from your database
  const recentUploads = [
    {
      id: "1",
      filename: "john_doe_resume.pdf",
      uploadDate: "2025-05-15T10:30:00Z",
      status: "Processed",
      matchScore: 85,
    },
    {
      id: "2",
      filename: "jane_smith_resume.pdf",
      uploadDate: "2025-05-15T09:45:00Z",
      status: "Processed",
      matchScore: 92,
    },
    {
      id: "3",
      filename: "mike_johnson_resume.pdf",
      uploadDate: "2025-05-14T16:20:00Z",
      status: "Processed",
      matchScore: 78,
    },
    {
      id: "4",
      filename: "sarah_williams_resume.pdf",
      uploadDate: "2025-05-14T14:10:00Z",
      status: "Processed",
      matchScore: 88,
    },
    {
      id: "5",
      filename: "david_brown_resume.pdf",
      uploadDate: "2025-05-14T11:05:00Z",
      status: "Processed",
      matchScore: 65,
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>You have uploaded 5 resumes in the last 2 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">File Name</th>
                  <th className="pb-2 font-medium">Upload Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Match Score</th>
                  <th className="pb-2 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((upload) => (
                  <tr key={upload.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{upload.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(upload.uploadDate)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>{upload.status}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>{upload.matchScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/candidates/${upload.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/candidates">View All Candidates</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
