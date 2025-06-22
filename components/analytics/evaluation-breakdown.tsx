'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    { name: 'Strongly Recommended', value: evaluationStats?.stronglyRecommended || 0 },
    { name: 'Recommended', value: evaluationStats?.recommended || 0 },
    { name: 'Not Recommended', value: evaluationStats?.notRecommended || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
              {`${(percent * 100).toFixed(0)}%`}
          </text>
      );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Recommendation Breakdown</CardTitle>
        <CardDescription>Distribution of candidate recommendations from AI evaluations.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
              >
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 