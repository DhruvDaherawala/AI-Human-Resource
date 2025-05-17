import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Download } from "lucide-react"

export function CandidatesList() {
  // Mock data - in a real app, this would come from your database
  const candidates = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      experience: "8 years",
      education: "M.S. Computer Science",
      matchScore: 92,
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      appliedFor: "Full Stack Developer",
      status: "Shortlisted",
    },
    {
      id: "2",
      name: "Sarah Williams",
      role: "Product Manager",
      location: "New York, NY",
      experience: "6 years",
      education: "MBA",
      matchScore: 88,
      skills: ["Product Strategy", "Agile", "User Research"],
      appliedFor: "Senior Product Manager",
      status: "Shortlisted",
    },
    {
      id: "3",
      name: "Michael Brown",
      role: "UX Designer",
      location: "Seattle, WA",
      experience: "5 years",
      education: "B.A. Design",
      matchScore: 85,
      skills: ["UI/UX", "Figma", "User Testing"],
      appliedFor: "Senior UX Designer",
      status: "Reviewing",
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Data Scientist",
      location: "Boston, MA",
      experience: "4 years",
      education: "Ph.D. Statistics",
      matchScore: 82,
      skills: ["Python", "Machine Learning", "SQL"],
      appliedFor: "Data Scientist",
      status: "Shortlisted",
    },
    {
      id: "5",
      name: "David Wilson",
      role: "Frontend Developer",
      location: "Austin, TX",
      experience: "3 years",
      education: "B.S. Computer Science",
      matchScore: 80,
      skills: ["React", "JavaScript", "CSS"],
      appliedFor: "Frontend Developer",
      status: "Reviewing",
    },
    {
      id: "6",
      name: "Jennifer Taylor",
      role: "Backend Developer",
      location: "Chicago, IL",
      experience: "7 years",
      education: "M.S. Software Engineering",
      matchScore: 78,
      skills: ["Java", "Spring", "Microservices"],
      appliedFor: "Backend Developer",
      status: "Reviewing",
    },
    {
      id: "7",
      name: "Robert Martinez",
      role: "DevOps Engineer",
      location: "Denver, CO",
      experience: "5 years",
      education: "B.S. Computer Engineering",
      matchScore: 75,
      skills: ["Docker", "Kubernetes", "CI/CD"],
      appliedFor: "DevOps Engineer",
      status: "Reviewing",
    },
    {
      id: "8",
      name: "Lisa Anderson",
      role: "Marketing Manager",
      location: "Los Angeles, CA",
      experience: "6 years",
      education: "B.A. Marketing",
      matchScore: 72,
      skills: ["Digital Marketing", "SEO", "Content Strategy"],
      appliedFor: "Marketing Director",
      status: "Reviewing",
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-500"
      case "Reviewing":
        return "bg-yellow-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{getInitials(candidate.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{candidate.name}</h3>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(candidate.status)}`} />
                    <span className="text-sm text-muted-foreground">{candidate.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                  <p className="text-sm text-muted-foreground">{candidate.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Match Score:</span>
                  <span className="text-sm font-bold text-primary">{candidate.matchScore}%</span>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Applied for:</span> {candidate.appliedFor}
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Download className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                  <Button size="sm" className="h-8 px-2" asChild>
                    <Link href={`/candidates/${candidate.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
