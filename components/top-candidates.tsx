import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

type Evaluation = {
  _id: string;
  candidateInfo: {
    name: string;
  };
  evaluation: {
    matchScore: number;
  };
  qualifications: {
    currentRole: string;
  };
};

type TopCandidatesProps = {
  candidates: Evaluation[];
  loading: boolean;
};

export function TopCandidates({ candidates, loading }: TopCandidatesProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Candidates</CardTitle>
        <CardDescription>Highest matching candidates across all job positions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))
          ) : (
            candidates.map((candidate) => (
              <div key={candidate._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(candidate.candidateInfo.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{candidate.candidateInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.qualifications.currentRole}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Match Score</p>
                    <p className="text-sm font-bold text-primary">{candidate.evaluation.matchScore}%</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/candidates/${candidate._id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/candidates">View All Candidates</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
