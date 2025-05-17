interface EducationItem {
  degree: string
  institution: string
  year: string
}

interface CandidateEducationProps {
  education: EducationItem[]
}

export function CandidateEducation({ education }: CandidateEducationProps) {
  return (
    <div className="space-y-6">
      {education.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between">
            <h3 className="font-medium">{item.degree}</h3>
            <span className="text-sm text-muted-foreground">{item.year}</span>
          </div>
          <p className="text-sm text-muted-foreground">{item.institution}</p>
        </div>
      ))}
    </div>
  )
}
