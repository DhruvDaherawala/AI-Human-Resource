interface JobRequirements {
  title: string
  description: string
  requirements: string
  skills: string[]
  experience: string
  education: string
}

interface CandidateProfile {
  name: string
  skills: string[]
  experience: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
  summary: string
}

interface MatchResult {
  score: number
  skillsMatch: {
    skill: string
    matched: boolean
  }[]
  experienceScore: number
  educationScore: number
  overallFit: number
}

export function matchCandidateToJob(candidate: CandidateProfile, job: JobRequirements): MatchResult {
  // In a real app, this would be a sophisticated ML algorithm
  // For this demo, we'll implement a simple matching logic

  // 1. Skills matching
  const skillsMatch = job.skills.map((requiredSkill) => {
    const matched = candidate.skills.some(
      (candidateSkill) => candidateSkill.toLowerCase() === requiredSkill.toLowerCase(),
    )
    return { skill: requiredSkill, matched }
  })

  const skillsScore = (skillsMatch.filter((s) => s.matched).length / job.skills.length) * 100

  // 2. Experience matching (simplified)
  // In a real app, you would analyze years of experience, relevance of roles, etc.
  const experienceScore = Math.min(
    candidate.experience.length * 25, // Each experience counts for 25 points up to 100
    100,
  )

  // 3. Education matching (simplified)
  // In a real app, you would analyze degree relevance, institution ranking, etc.
  const educationScore = Math.min(
    candidate.education.length * 50, // Each education counts for 50 points up to 100
    100,
  )

  // 4. Calculate overall match score
  // Weights can be adjusted based on job requirements
  const weights = {
    skills: 0.5,
    experience: 0.3,
    education: 0.2,
  }

  const overallScore = Math.round(
    skillsScore * weights.skills + experienceScore * weights.experience + educationScore * weights.education,
  )

  return {
    score: overallScore,
    skillsMatch,
    experienceScore,
    educationScore,
    overallFit: overallScore,
  }
}
