import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CandidatesList } from "@/components/candidates-list"

export const metadata: Metadata = {
  title: "Candidates | AI Resume Screening",
  description: "View and manage shortlisted candidates",
}

export default function CandidatesPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
          <p className="text-sm text-muted-foreground">View and manage all candidates in your talent pool.</p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Input placeholder="Search candidates..." className="w-full sm:w-[300px]" />
          <Button variant="outline" size="sm">
            Search
          </Button>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="product-manager">Product Manager</SelectItem>
              <SelectItem value="data-scientist">Data Scientist</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="match">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CandidatesList />
    </div>
  )
}
