import { BarChart, FileText, Users, Briefcase, CheckCircle2, XCircle, Circle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, Col, Row, Statistic } from 'antd';

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
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs,
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Total Evaluations",
      value: stats?.shortlistedCandidates,
      icon: <Users className="h-8 w-8 text-purple-500" />,
    },
    {
      title: "Avg. Match Rate",
      value: stats?.avgMatchRate,
      icon: <BarChart className="h-8 w-8 text-yellow-500" />,
      suffix: "%",
    },
    {
      title: "Pending Resumes",
      value: stats?.resumeStats?.pending,
      icon: <Circle className="h-8 w-8 text-gray-500" />,
    
    },
    {
      title: "Strongly Recommended",
      value: stats?.evaluationStats?.stronglyRecommended,
      icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
     
    },
    {
      title: "Recommended",
      value: stats?.evaluationStats?.recommended,
      icon: <CheckCircle2 className="h-8 w-8 text-green-400" />,
      
    },
    {
      title: "Not Recommended",
      value: stats?.evaluationStats?.notRecommended,
      icon: <XCircle className="h-8 w-8 text-red-500" />,
      
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card>
                  {loading ? (
                      <Skeleton className="h-24 w-full" />
                  ) : (
                      <Statistic
                          title={<span className="text-base font-medium text-muted-foreground">{card.title}</span>}
                          value={card.value}
                          precision={0}
                          prefix={card.icon}
                          suffix={card.suffix}
                          valueStyle={{ fontSize: '2rem', fontWeight: 'bold' }}
                      />
                  )}
              </Card>
          </Col>
      ))}
  </Row>
  )
}
