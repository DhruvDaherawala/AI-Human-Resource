import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandidateProfile } from "@/components/candidate-profile"
import { CandidateSkills } from "@/components/candidate-skills"
import { CandidateExperience } from "@/components/candidate-experience"
import { CandidateEducation } from "@/components/candidate-education"
import { CandidateMatchScore } from "@/components/candidate-match-score"
import { MLEvaluationResults } from "@/components/ml-evaluation-results"

export default function CandidatePage({ params }) {
  // In a real app, this would fetch from your database
  const candidate = {
    id: params.id,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    currentRole: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    summary:
      "Experienced software engineer with 8+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
    matchScore: 92,
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB", "GraphQL", "CI/CD"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        duration: "2020 - Present",
        description: "Leading development of cloud-based SaaS products, managing a team of 5 engineers.",
      },
      {
        title: "Software Engineer",
        company: "WebDev Co.",
        duration: "2017 - 2020",
        description: "Developed and maintained multiple web applications using React and Node.js.",
      },
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2017",
      },
      {
        degree: "B.S. Computer Science",
        institution: "UC Berkeley",
        year: "2015",
      },
    ],
    appliedFor: "Full Stack Developer",
  }

  // Mock ML evaluation result
  const mlEvaluation = {
    score: 92,
    skillsAnalysis: {
      matched: ["React", "Node.js", "TypeScript"],
      missing: ["GraphQL"],
    },
    experienceEvaluation:
      "The candidate has excellent experience that exceeds the requirements. 8+ years in full-stack development with relevant technologies.",
    educationEvaluation:
      "The candidate's education is excellent. Master's degree in Computer Science from Stanford University.",
    recommendation: "Strongly Recommend",
    reasoning:
      "This candidate is an excellent match for the position. They have all the required skills except GraphQL, but their extensive experience with similar technologies suggests they can quickly learn it. Their education and work history are impressive and directly relevant to the role.",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-lg font-semibold">AI Resume Screening</h1>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/jobs" className="text-sm font-medium hover:underline underline-offset-4">
              Jobs
            </Link>
            <Link href="/candidates" className="text-sm font-medium hover:underline underline-offset-4">
              Candidates
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:underline underline-offset-4">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <Link href="/candidates" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                  ← Back to Candidates
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">{candidate.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-muted-foreground">{candidate.currentRole}</p>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-muted-foreground">{candidate.location}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Download Resume</Button>
                <Button>Contact Candidate</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Profile</CardTitle>
                    <CardDescription>
                      Applied for: <Badge variant="outline">{candidate.appliedFor}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CandidateProfile candidate={candidate} />
                  </CardContent>
                </Card>

                <Tabs defaultValue="skills" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="ai-evaluation">AI Evaluation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CandidateSkills skills={candidate.skills} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="experience" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CandidateExperience experience={candidate.experience} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="education" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CandidateEducation education={candidate.education} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="ai-evaluation" className="space-y-4">
                    <MLEvaluationResults matchResult={mlEvaluation} />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Score</CardTitle>
                    <CardDescription>AI-generated match score for this position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CandidateMatchScore score={candidate.matchScore} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{candidate.location}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full">Schedule Interview</Button>
                    <Button variant="outline" className="w-full">
                      Add to Shortlist
                    </Button>
                    <Button variant="outline" className="w-full">
                      Reject Candidate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
