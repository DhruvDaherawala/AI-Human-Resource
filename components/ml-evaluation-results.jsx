import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function MLEvaluationResults({ matchResult }) {
  if (!matchResult) return null

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "Strongly Recommend":
        return "bg-green-500 text-white"
      case "Recommend":
        return "bg-blue-500 text-white"
      case "Maybe":
        return "bg-yellow-500 text-white"
      case "Not Recommended":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Evaluation Results</CardTitle>
        <CardDescription>Powered by Grok AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Overall Match Score</h3>
            <p className="text-sm text-muted-foreground">Based on skills, experience, and education</p>
          </div>
          <div className="text-3xl font-bold">{matchResult.score}%</div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Recommendation</h3>
          <Badge className={`${getRecommendationColor(matchResult.recommendation)} px-3 py-1`}>
            {matchResult.recommendation}
          </Badge>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Skills Analysis</h3>
          <div className="space-y-2">
            {matchResult.skillsAnalysis && typeof matchResult.skillsAnalysis === "string" ? (
              <p className="text-sm">{matchResult.skillsAnalysis}</p>
            ) : (
              <ul className="space-y-1">
                {matchResult.skillsAnalysis &&
                  matchResult.skillsAnalysis.matched &&
                  matchResult.skillsAnalysis.matched.map((skill, index) => (
                    <li key={`matched-${index}`} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {skill}
                    </li>
                  ))}
                {matchResult.skillsAnalysis &&
                  matchResult.skillsAnalysis.missing &&
                  matchResult.skillsAnalysis.missing.map((skill, index) => (
                    <li key={`missing-${index}`} className="flex items-center text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      {skill}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-1">Experience Evaluation</h3>
          <p className="text-sm">{matchResult.experienceEvaluation}</p>
        </div>

        <div>
          <h3 className="text-md font-medium mb-1">Education Evaluation</h3>
          <p className="text-sm">{matchResult.educationEvaluation}</p>
        </div>

        {matchResult.reasoning && (
          <div>
            <h3 className="text-md font-medium mb-1">Reasoning</h3>
            <p className="text-sm text-muted-foreground">{matchResult.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
