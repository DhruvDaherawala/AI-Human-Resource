import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Evaluation = {
  _id: string;
  candidateInfo: {
    name: string;
  };
  evaluation: {
    matchScore: number;
  };
  metadata: {
    createdAt: string;
    status: string;
  };
};

type RecentUploadsProps = {
  uploads: Evaluation[];
  loading: boolean;
};

export function RecentUploads({ uploads, loading }: RecentUploadsProps) {
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
        <CardDescription>
          {loading ? "Loading recent uploads..." : `You have ${uploads.length} recent uploads.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Candidate Name</th>
                  <th className="pb-2 font-medium">Upload Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Match Score</th>
                  <th className="pb-2 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="py-3 text-right">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : (
                  uploads.map((upload) => (
                    <tr key={upload._id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{upload.candidateInfo.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(upload.metadata.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${upload.metadata.status === 'Processed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span>{upload.metadata.status}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>{upload.evaluation.matchScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/candidates/${upload._id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
