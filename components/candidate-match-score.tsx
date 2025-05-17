interface CandidateMatchScoreProps {
  score: number
}

export function CandidateMatchScore({ score }: CandidateMatchScoreProps) {
  const getScoreColor = () => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle className="stroke-muted-foreground/20" cx="50" cy="50" r="40" fill="transparent" strokeWidth="10" />
          <circle
            className={`${getScoreColor()}`}
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeWidth="10"
            strokeDasharray={`${score * 2.51} 251`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Match Score</p>
        <p className="text-xs text-muted-foreground">Based on job requirements</p>
      </div>
    </div>
  )
}
