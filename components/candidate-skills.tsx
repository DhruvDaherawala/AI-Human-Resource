import { Badge } from "@/components/ui/badge"

interface CandidateSkillsProps {
  skills: string[]
}

export function CandidateSkills({ skills }: CandidateSkillsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  )
}
