'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { Search, Briefcase, Users, ArrowUpDown, Filter, ArrowLeft, Mail, Phone, MapPin, Building2, GraduationCap, Star, AlertTriangle, CheckCircle2, XCircle, Circle } from 'lucide-react';

type Job = {
  _id: string;
  title: string;
  department: string;
};

type CandidateEvaluation = {
  _id: string;
  resumeId: string;
  jobId: string;
  jobTitle?: string;
  candidateInfo: {
    name: string;
    location: string;
    email: string;
    phone: string;
  };
  qualifications: {
    skills: string[];
    education: string;
    currentRole: string;
    currentCompany: string;
  };
  evaluation: {
    matchScore: number;
    recommendation: string;
    skillAnalysis: {
      matchingSkills: string[];
      missingSkills: string[];
      skillGap: string;
    };
    experienceEvaluation: {
      relevance: string;
      yearsOfExperience: number;
      keyAchievements: string[];
    };
    educationEvaluation: {
      relevance: string;
      qualificationMatch: string;
    };
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    reasoning: string;
  };
  metadata: {
    status: string;
    manualStatus: string | null;
    createdAt: string;
  };
};

export default function CandidatesPage() {
  const [evaluations, setEvaluations] = useState<CandidateEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});

  // Fetch evaluations and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch evaluations
        const evaluationsRes = await fetch('/api/evaluations');
        const evaluationsData = await evaluationsRes.json();
        setEvaluations(evaluationsData);

        // Fetch jobs for the filter
        const jobsRes = await fetch('/api/jobs');
        const jobsData = await jobsRes.json();
        setJobs(jobsData);

        // Create a map of job IDs to titles
        const jobTitleMap = jobsData.reduce((acc: Record<string, string>, job: Job) => {
          acc[job._id] = job.title;
          return acc;
        }, {});
        setJobTitles(jobTitleMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch candidate data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort evaluations
  const filteredEvaluations = evaluations
    .filter(evaluation => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          evaluation.candidateInfo.name.toLowerCase().includes(query) ||
          evaluation.candidateInfo.email.toLowerCase().includes(query) ||
          evaluation.qualifications.currentRole.toLowerCase().includes(query) ||
          jobTitles[evaluation.jobId]?.toLowerCase().includes(query)
        );
      }
      // Job filter
      if (selectedJob !== 'all') {
        return evaluation.jobId === selectedJob;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.evaluation.matchScore - a.evaluation.matchScore;
        case 'recent':
          return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
        case 'experience':
          return b.evaluation.experienceEvaluation.yearsOfExperience - a.evaluation.experienceEvaluation.yearsOfExperience;
        default:
          return 0;
      }
    });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container pb-8">
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Evaluated Candidates</h2>
            <p className="text-sm text-muted-foreground">View and manage all evaluated candidates</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              {filteredEvaluations.length} Candidates
            </Badge>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search candidates..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by job" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading candidates...</p>
            </div>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No candidates found matching your search.' : 'No evaluated candidates found.'}
            </p>
            <p className="text-sm text-muted-foreground">Process some resumes to see evaluated candidates.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvaluations.map((evaluation) => (
              <Card key={evaluation._id} className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{evaluation.candidateInfo.name}</CardTitle>
                      <CardDescription className="text-base">{evaluation.qualifications.currentRole}</CardDescription>
                      {evaluation.jobTitle && (
                        <p className="text-sm text-muted-foreground">Evaluated for {evaluation.jobTitle}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-primary">
                          {evaluation.evaluation.matchScore}%
                        </div>
                        {evaluation.metadata.manualStatus === 'shortlisted' && (
                          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                            <Circle className="h-2 w-2 fill-green-600" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Shortlisted</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={
                        evaluation.evaluation.recommendation === 'Strongly Recommended' ? 'default' :
                        evaluation.evaluation.recommendation === 'Recommended' ? 'secondary' :
                        'outline'
                      }>
                        {evaluation.evaluation.recommendation}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.qualifications.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                      {evaluation.qualifications.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{evaluation.qualifications.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      {new Date(evaluation.metadata.createdAt).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                      <Link href={`/candidates/${evaluation._id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
