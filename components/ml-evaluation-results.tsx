"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface MLEvaluationResultsProps {
  candidateId?: string
}

export function MLEvaluationResults({ candidateId }: MLEvaluationResultsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Evaluation Results</CardTitle>
        <Brain className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Skills Match</p>
                <p className="text-sm text-muted-foreground">Based on job requirements</p>
              </div>
              <div className="text-2xl font-bold">85%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Experience Level</p>
                <p className="text-sm text-muted-foreground">Years of relevant experience</p>
              </div>
              <div className="text-2xl font-bold">4.5</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Overall Score</p>
                <p className="text-sm text-muted-foreground">Combined evaluation</p>
              </div>
              <div className="text-2xl font-bold">92%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 