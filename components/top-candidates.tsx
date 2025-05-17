import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopCandidates() {
  // Mock data - in a real app, this would come from your database
  const candidates = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Senior Software Engineer",
      matchScore: 92,
      skills: ["React", "Node.js", "TypeScript"],
      appliedFor: "Full Stack Developer",
    },
    {
      id: "2",
      name: "Sarah Williams",
      role: "Product Manager",
      matchScore: 88,
      skills: ["Product Strategy", "Agile", "User Research"],
      appliedFor: "Senior Product Manager",
    },
    {
      id: "3",
      name: "Michael Brown",
      role: "UX Designer",
      matchScore: 85,
      skills: ["UI/UX", "Figma", "User Testing"],
      appliedFor: "Senior UX Designer",
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Data Scientist",
      matchScore: 82,
      skills: ["Python", "Machine Learning", "SQL"],
      appliedFor: "Data Scientist",
    },
    {
      id: "5",
      name: "David Wilson",
      role: "Frontend Developer",
      matchScore: 80,
      skills: ["React", "JavaScript", "CSS"],
      appliedFor: "Frontend Developer",
    },
  ]

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
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">Match Score</p>
                  <p className="text-sm font-bold text-primary">{candidate.matchScore}%</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/candidates/${candidate.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
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
