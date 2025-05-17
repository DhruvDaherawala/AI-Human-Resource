interface ExperienceItem {
  title: string
  company: string
  duration: string
  description: string
}

interface CandidateExperienceProps {
  experience: ExperienceItem[]
}

export function CandidateExperience({ experience }: CandidateExperienceProps) {
  return (
    <div className="space-y-6">
      {experience.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between">
            <h3 className="font-medium">{item.title}</h3>
            <span className="text-sm text-muted-foreground">{item.duration}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{item.company}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
