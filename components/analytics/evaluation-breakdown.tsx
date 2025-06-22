'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type EvaluationStats = {
  stronglyRecommended: number;
  recommended: number;
  notRecommended: number;
};

type EvaluationBreakdownProps = {
  evaluationStats: EvaluationStats | null;
  loading: boolean;
};

export function EvaluationBreakdown({ evaluationStats, loading }: EvaluationBreakdownProps) {
  const data = [
    { name: 'Strongly Recommended', count: evaluationStats?.stronglyRecommended || 0 },
    { name: 'Recommended', count: evaluationStats?.recommended || 0 },
    { name: 'Not Recommended', count: evaluationStats?.notRecommended || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Recommendation Breakdown</CardTitle>
        <CardDescription>Distribution of candidate recommendations from AI evaluations.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 