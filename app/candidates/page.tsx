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
import { Search, Briefcase, Users, ArrowUpDown, Filter, ArrowLeft, Mail, Phone, MapPin, Building2, GraduationCap, Star, AlertTriangle, CheckCircle2, XCircle, Circle, FileText } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

type ResumeStats = {
  totalResumes: number;
  totalEvaluations: number;
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

export default function CandidatesPage() {
  const [evaluations, setEvaluations] = useState<CandidateEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});
  const [view, setView] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [stats, setStats] = useState<ResumeStats | null>(null);

  // Fetch evaluations, jobs, and stats
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

        // Fetch resume statistics
        const statsRes = await fetch('/api/resumes/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

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
        if (
          !(
            evaluation.candidateInfo.name.toLowerCase().includes(query) ||
            evaluation.candidateInfo.email.toLowerCase().includes(query) ||
            evaluation.qualifications.currentRole.toLowerCase().includes(query) ||
            jobTitles[evaluation.jobId]?.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }
      // Job filter
      if (selectedJob !== 'all' && evaluation.jobId !== selectedJob) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && evaluation.metadata.manualStatus !== selectedStatus) {
        return false;
      }
      // Recommendation filter
      if (selectedRecommendation !== 'all' && evaluation.evaluation.recommendation !== selectedRecommendation) {
        return false;
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

  // Pagination logic for table view
  const totalPages = Math.ceil(filteredEvaluations.length / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredEvaluations.slice(indexOfFirstItem, indexOfLastItem);

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
            <h2 className="text-2xl font-semibold tracking-tight">Matched Candidates</h2>
            <p className="text-sm text-muted-foreground">View and manage all evaluated candidates</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Total Resumes Badge */}
            <Badge variant="outline" className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              {stats?.totalResumes || 0} Candidates
            </Badge>
            {/* Total Matches Badge */}
            <Badge variant="secondary" className="px-3 py-1 bg-green-50 dark:bg-green-950/30">
              <Users className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              {stats?.totalEvaluations || 0} Matches
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalResumes}</div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {stats.resumeStats.pending} pending, {stats.resumeStats.reviewed} reviewed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalEvaluations}</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Candidates matched with jobs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Strongly Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.evaluationStats.stronglyRecommended}</div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Top candidates
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.evaluationStats.recommended}</div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Good candidates
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRecommendation} onValueChange={setSelectedRecommendation}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations</SelectItem>
                <SelectItem value="Strongly Recommended">Strongly Recommended</SelectItem>
                <SelectItem value="Recommended">Recommended</SelectItem>
                <SelectItem value="Not Recommended">Not Recommended</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-row gap-3 items-center w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[150px]">
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
              <div className="flex-1 flex justify-end">
                <ToggleGroup type="single" value={view} onValueChange={v => (v === 'card' || v === 'table') && setView(v)}>
                  <ToggleGroupItem value="card" aria-label="Card View">Card View</ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Table View">Table View</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate List */}
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
        ) : view === 'card' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvaluations.map((evaluation) => (
              <Card key={evaluation._id} className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{evaluation.candidateInfo.name}</CardTitle>
                      {jobTitles[evaluation.jobId] && (
                        <p className="text-sm text-muted-foreground">Evaluated for {jobTitles[evaluation.jobId]}</p>
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
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card/80 shadow-sm">
            {/* Entries per page dropdown */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={entriesPerPage.toString()} onValueChange={(value) => setEntriesPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEvaluations.length)} of {filteredEvaluations.length} entries
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Applied</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((evaluation) => (
                  <TableRow key={evaluation._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(evaluation.candidateInfo.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{evaluation.candidateInfo.name}</div>
                          <div className="text-sm text-muted-foreground">{evaluation.candidateInfo.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {jobTitles[evaluation.jobId] || 'Unknown Job'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold text-primary">
                          {evaluation.evaluation.matchScore}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        evaluation.evaluation.recommendation === 'Strongly Recommended' ? 'default' :
                        evaluation.evaluation.recommendation === 'Recommended' ? 'secondary' :
                        'outline'
                      }>
                        {evaluation.evaluation.recommendation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {evaluation.metadata.manualStatus ? (
                        <Badge variant={
                          evaluation.metadata.manualStatus === 'shortlisted' ? 'default' :
                          evaluation.metadata.manualStatus === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {evaluation.metadata.manualStatus}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Set</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(evaluation.metadata.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/candidates/${evaluation._id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
