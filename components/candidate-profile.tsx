interface CandidateProfileProps {
  candidate: {
    name: string
    currentRole: string
    company: string
    location: string
    summary: string
  }
}

export function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Summary</h3>
        <p className="text-muted-foreground">{candidate.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium">Current Role</h3>
          <p className="text-sm text-muted-foreground">{candidate.currentRole}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Company</h3>
          <p className="text-sm text-muted-foreground">{candidate.company}</p>
        </div>
      </div>
    </div>
  )
}
