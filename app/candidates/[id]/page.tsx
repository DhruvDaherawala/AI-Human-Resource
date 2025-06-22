'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Building2, GraduationCap, Briefcase, Star, AlertTriangle, CheckCircle2, XCircle, Calendar, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<CandidateEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`/api/evaluations/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch evaluation');
        }
        const data = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        toast.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [params.id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const updateStatus = async (status: 'shortlisted' | 'rejected') => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/evaluations/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedEvaluation = await response.json();
      setEvaluation(updatedEvaluation);
      toast.success(`Candidate ${status === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update candidate status');
    } finally {
      setUpdating(false);
    }
  };

  const handleScheduleInterview = async () => {
    try {
      setIsScheduling(true);
      // TODO: Implement interview scheduling logic
      toast.success('Interview scheduled successfully');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
    } finally {
      setIsScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Candidate Not Found</h2>
          <p className="text-muted-foreground mb-6">The candidate evaluation you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/candidates" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Candidates
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-2">
      <div className="flex flex-col space-y-4">
        {/* Button Row and Evaluated For */}
        <div className="flex flex-col mb-2">
          <div className="flex flex-row flex-wrap items-center justify-between mb-2 w-full">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/candidates">
                <ArrowLeft className="h-4 w-4" />
                Back to Candidates
              </Link>
            </Button>
            <div className="flex flex-row flex-wrap gap-2 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Calendar className="h-5 w-5" />
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                      Schedule an interview with {evaluation?.candidateInfo.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="date" className="text-right text-sm font-medium">
                        Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="time" className="text-right text-sm font-medium">
                        Time
                      </label>
                      <input
                        id="time"
                        type="time"
                        className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="type" className="text-right text-sm font-medium">
                        Type
                      </label>
                      <select
                        id="type"
                        className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="online">Online</option>
                        <option value="onsite">On-site</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="notes" className="text-right text-sm font-medium">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        rows={3}
                        placeholder="Add any additional notes..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleScheduleInterview}
                      disabled={isScheduling}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      {isScheduling ? 'Scheduling...' : 'Schedule'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => updateStatus('shortlisted')}
                disabled={updating || evaluation?.metadata.manualStatus === 'shortlisted'}
              >
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Add to Shortlist
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => updateStatus('rejected')}
                disabled={updating || evaluation?.metadata.manualStatus === 'rejected'}
              >
                <XCircle className="h-5 w-5 text-red-500" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/resume/${evaluation.resumeId}`);
                    if (!res.ok) throw new Error('Failed to fetch resume');
                    const data = await res.json();
                    const byteCharacters = atob(data.data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: data.contentType });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data.filename || 'resume';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    toast.error('Failed to download resume');
                  }
                }}
              >
                <Download className="h-5 w-5" />
                Download Resume
              </Button>
            </div>
          </div>
          {evaluation?.jobTitle && (
            <div className="flex justify-start w-full">
              <span className="inline-block text-lg font-bold px-6 py-2 rounded-lg shadow bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 dark:from-blue-900 dark:to-blue-700 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                Evaluated for {evaluation.jobTitle}
              </span>
            </div>
          )}
        </div>
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight"></h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Candidate Profile */}
            <Card className="bg-blue-100 dark:bg-blue-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(59,130,246,0.15)] dark:shadow-[0_8px_24px_rgba(59,130,246,0.25)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14 border-2 border-blue-200 dark:border-blue-800">
                      <AvatarFallback className="text-base">
                        {getInitials(evaluation.candidateInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg mb-0.5">{evaluation.candidateInfo.name}</CardTitle>
                      <CardDescription className="text-sm">{evaluation.qualifications.currentRole}</CardDescription>
                    </div>
                  </div>
                  {evaluation?.metadata.manualStatus === 'shortlisted' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30">
                      <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Shortlisted</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100/50 dark:bg-blue-900/30">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Location</p>
                      <p className="text-sm">{evaluation.candidateInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100/50 dark:bg-blue-900/30">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{evaluation.candidateInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100/50 dark:bg-blue-900/30">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{evaluation.candidateInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100/50 dark:bg-blue-900/30">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Current Company</p>
                      <p className="text-sm">{evaluation.qualifications.currentCompany}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Summary */}
            <Card className="bg-green-100 dark:bg-green-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(34,197,94,0.15)] dark:shadow-[0_8px_24px_rgba(34,197,94,0.25)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Evaluation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Match Score</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{evaluation.evaluation.matchScore}%</p>
                    </div>
                  </div>
                  <Badge variant={
                    evaluation.evaluation.recommendation === 'Strongly Recommended' ? 'default' :
                    evaluation.evaluation.recommendation === 'Recommended' ? 'secondary' :
                    'outline'
                  } className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    {evaluation.evaluation.recommendation}
                  </Badge>
                </div>
                <Separator className="bg-green-200/50 dark:bg-green-800/50" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.analysis.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 bg-green-100/50 dark:bg-green-900/30 text-black dark:text-white">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <Card className="bg-blue-100 dark:bg-blue-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(59,130,246,0.15)] dark:shadow-[0_8px_24px_rgba(59,130,246,0.25)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Matching Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.evaluation.skillAnalysis.matchingSkills.map((skill, index) => (
                      <Badge key={index} variant="default" className="text-xs px-2 py-0.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-transparent hover:bg-transparent">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.evaluation.skillAnalysis.missingSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Skill Gap Analysis</p>
                  <p className="text-sm leading-relaxed text-black dark:text-white">{evaluation.evaluation.skillAnalysis.skillGap}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Experience */}
            <Card className="bg-orange-100 dark:bg-orange-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(249,115,22,0.15)] dark:shadow-[0_8px_24px_rgba(249,115,22,0.25)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Years of Experience</p>
                    <Badge variant="secondary" className="text-xs">{evaluation.evaluation.experienceEvaluation.yearsOfExperience} years</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Relevance</p>
                    <Badge variant="outline" className="text-xs">{evaluation.evaluation.experienceEvaluation.relevance}</Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-100/50 dark:bg-orange-900/30">
                      <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-sm font-medium">Key Achievements</p>
                  </div>
                  <ul className="space-y-1.5 pl-10">
                    {evaluation.evaluation.experienceEvaluation.keyAchievements.map((achievement, index) => (
                      <li key={index} className="text-sm flex items-start gap-1.5">
                        <span className="text-orange-600 dark:text-orange-400">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-indigo-100 dark:bg-indigo-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(99,102,241,0.15)] dark:shadow-[0_8px_24px_rgba(99,102,241,0.25)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Qualification</p>
                  <p className="text-xs">{evaluation.qualifications.education}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Relevance</p>
                  <Badge variant="outline" className="text-xs">{evaluation.evaluation.educationEvaluation.relevance}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Match</p>
                  <Badge variant="secondary" className="text-xs">{evaluation.evaluation.educationEvaluation.qualificationMatch}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Analysis & Reasoning */}
            <Card className="bg-rose-100 dark:bg-rose-950/20 backdrop-blur-sm border-0 shadow-[0_8px_24px_rgba(244,63,94,0.15)] dark:shadow-[0_8px_24px_rgba(244,63,94,0.25)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  Analysis & Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Detailed Analysis</p>
                  <div className="bg-rose-100/50 dark:bg-rose-900/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-line">{evaluation.analysis.reasoning}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Areas for Improvement</p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.analysis.weaknesses.map((weakness, index) => (
                      <Badge key={index} variant="destructive" className="text-xs px-2 py-0.5">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 