'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/components/dashboard-stats';
import { useAuth } from '@/lib/auth-context';
import { EvaluationBreakdown } from '@/components/analytics/evaluation-breakdown';
import { QuickActions } from '@/components/quick-actions';

type Stats = {
  totalResumes: number;
  activeJobs: number;
  shortlistedCandidates: number;
  avgMatchRate: number;
  resumeStats: {
    pending: number;
    reviewed: number;
  };
  evaluationStats: {
    stronglyRecommended: number;
    recommended: number;
    notRecommended: number;
  };
};

type Evaluation = {
  _id: string;
  candidateInfo: {
    name:string;
  };
  evaluation: {
    matchScore: number;
  };
  qualifications: {
    currentRole: string;
  };
  metadata: {
    createdAt: string;
    status: string;
  };
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [evaluationStats, setEvaluationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, jobsRes, evaluationsRes] = await Promise.all([
          fetch('/api/resumes/stats'),
          fetch('/api/jobs'),
          fetch('/api/evaluations'),
        ]);

        const statsData = await statsRes.json();
        const jobsData = await jobsRes.json();
        const evaluationsData: Evaluation[] = await evaluationsRes.json();

        // Process stats
        const activeJobs = jobsData.filter((job: any) => job.status === 'active').length;
        const { totalResumes, totalEvaluations, evaluationStats, resumeStats } = statsData;
        const avgMatchRate =
          totalEvaluations > 0
            ? Math.round(
                ((evaluationStats.stronglyRecommended + evaluationStats.recommended) / totalEvaluations) * 100
              )
            : 0;
        
        setStats({
          totalResumes,
          activeJobs,
          shortlistedCandidates: totalEvaluations,
          avgMatchRate,
          resumeStats,
          evaluationStats,
        });

        setEvaluationStats(evaluationStats);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's what's happening with your hiring process.
          </p>
        </div>
      </div>

      <DashboardStats stats={stats} loading={loading} />
      
      {/* <div className="grid gap-8 md:grid-cols-2">
        <EvaluationBreakdown evaluationStats={evaluationStats} loading={loading} />
        <QuickActions />
      </div> */}
    </div>
  );
}
