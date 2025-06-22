'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Briefcase, X, MapPin, Calendar, Building2, Clock } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  status: 'active' | 'closed';
  postedDate: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    salary: '',
    status: 'active' as 'active' | 'closed',
  });
  const [requirementInput, setRequirementInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [view, setView] = useState<'card' | 'table'>('card');

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data.sort((a: Job, b: Job) => 
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      ));
    } catch (error) {
      toast.error('Failed to fetch jobs. Please refresh the page.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && requirementInput.trim()) {
      e.preventDefault();
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: '',
      description: '',
      requirements: '',
      salary: '',
      status: 'active',
    });
    setRequirements([]);
    setRequirementInput('');
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingJob 
        ? `/api/jobs/${editingJob._id}`
        : '/api/jobs';
      
      const method = editingJob ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        requirements: requirements,
      };

      console.log('Submitting job data:', {
        url,
        method,
        submitData,
        editingJob
      });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to save job');
      }
      
      toast.success(
        editingJob 
          ? 'Job updated successfully!' 
          : 'Job posted successfully!',
        {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        }
      );
      setIsModalOpen(false);
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save job. Please try again.';
      
      console.error('Detailed error:', {
        message: errorMessage,
        error
      });

      toast.error(errorMessage, {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    }
  };

  const handleEdit = async (job: Job) => {
    if (!job._id) {
      console.error('No job ID provided for edit');
      toast.error('Invalid job ID', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
      return;
    }

    try {
      const verifyRes = await fetch(`/api/jobs/${job._id}`);
      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.error || 'Failed to verify job');
      }

      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: '', // We'll handle requirements separately
        salary: job.salary,
        status: job.status,
      });
      
      // Handle requirements properly
      if (Array.isArray(job.requirements)) {
        setRequirements(job.requirements);
      } else if (typeof job.requirements === 'string') {
        setRequirements([job.requirements]);
      } else {
        setRequirements([]);
      }
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Edit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit job. Please try again.';
      toast.error(errorMessage, {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('No job ID provided for delete');
      toast.error('Invalid job ID', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      // First verify the job exists
      const verifyRes = await fetch(`/api/jobs/${id}`);
      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.error || 'Failed to verify job');
      }

      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete job');
      }

      toast.success('Job deleted successfully!', {
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #86EFAC'
        }
      });
      
      // Refresh the jobs list
      await fetchJobs();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete job. Please try again.';
      toast.error(errorMessage, {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Post New Job'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter job title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter job location"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter job description"
                    required
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements</label>
                  <div className="space-y-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={handleRequirementKeyDown}
                      placeholder="Type requirement and press Enter"
                      className="mb-2"
                    />
                    <div className="flex flex-wrap gap-2">
                      {requirements.map((req, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                        >
                          <span>{req}</span>
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="hover:text-primary/80"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary</label>
                    <Input
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="Enter salary range"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/50 rounded-lg">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm mt-2">Start by posting a new job</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <ToggleGroup type="single" value={view} onValueChange={v => (v === 'card' || v === 'table') && setView(v)}>
                <ToggleGroupItem value="card" aria-label="Card View">Card View</ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table View">Table View</ToggleGroupItem>
              </ToggleGroup>
            </div>
            {view === 'card' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="group relative rounded-lg border bg-card/80 backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(job)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(job._id)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {job.type}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                          ${job.status === 'active' 
                            ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                          {job.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>Salary: {job.salary}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-primary hover:text-primary/80"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border bg-card/80 shadow-sm">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Salary</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Posted</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{job.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                        <td className="px-6 py-4 text-muted-foreground">{job.location}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {job.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                            ${job.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{job.salary}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(job.postedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(job)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(job._id)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-primary hover:text-primary/80"
                              onClick={() => {
                                setSelectedJob(job);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Job Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Job Details</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{selectedJob.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        {selectedJob.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
                        ${selectedJob.status === 'active' 
                          ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                        {selectedJob.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Salary: {selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Posted: {new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-medium text-foreground">Description</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-medium text-foreground">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedJob.requirements) ? (
                        selectedJob.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                          >
                            {req}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {selectedJob.requirements}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="px-4"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleEdit(selectedJob);
                    }}
                    className="px-4"
                  >
                    Edit Job
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 