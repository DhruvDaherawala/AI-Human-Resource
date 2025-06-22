import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, FileText, Users, Briefcase, CheckCircle2, XCircle, Circle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

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

type DashboardStatsProps = {
  stats: Stats | null;
  loading: boolean;
};

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Resumes",
      value: stats?.totalResumes,
      icon: FileText,
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs,
      icon: Briefcase,
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      title: "Total Evaluations",
      value: stats?.shortlistedCandidates,
      icon: Users,
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Avg. Match Rate",
      value: stats?.avgMatchRate,
      icon: BarChart,
      isPercentage: true,
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Pending Resumes",
      value: stats?.resumeStats?.pending,
      icon: Circle,
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      title: "Strongly Recommended",
      value: stats?.evaluationStats?.stronglyRecommended,
      icon: CheckCircle2,
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Recommended",
      value: stats?.evaluationStats?.recommended,
      icon: CheckCircle2,
      bgColor: "bg-green-50/70 dark:bg-green-950/50",
    },
    {
      title: "Not Recommended",
      value: stats?.evaluationStats?.notRecommended,
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index} className={card.bgColor}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">
                {card.value}
                {card.isPercentage && "%"}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
