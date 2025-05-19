'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table, Upload, FileText, Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

type Resume = {
  _id: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: string;
  processingStatus?: string;
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingAll, setProcessingAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch resumes
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      // Sort resumes by date, most recent first
      const sortedData = data.sort((a: Resume, b: Resume) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      setResumes(sortedData);
    } catch (error) {
      toast.error('Failed to fetch resumes. Please refresh the page.', {
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
    fetchResumes();
  }, []);

  // Upload resume
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('Resume uploaded successfully!', {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
        fetchResumes();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error('Failed to upload resume. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred while uploading. Please try again.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete resume
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    try {
      const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Resume deleted successfully!', {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
        fetchResumes();
      } else {
        toast.error('Failed to delete resume. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred while deleting. Please try again.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    }
  };

  // Update resume status
  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Resume marked as ${status}!`, {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
        fetchResumes();
      } else {
        toast.error('Failed to update resume status. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred while updating. Please try again.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    }
  };

  // Process all pending resumes
  const handleProcessAll = async () => {
    const pendingResumes = resumes.filter(resume => resume.status === 'pending');
    if (pendingResumes.length === 0) {
      toast.error('No pending resumes to process', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
      return;
    }

    setProcessingAll(true);
    try {
      const promises = pendingResumes.map(resume => 
        fetch(`/api/resume/${resume._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'reviewed' }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccessful = results.every(res => res.ok);

      if (allSuccessful) {
        toast.success(`Successfully processed ${pendingResumes.length} resumes!`, {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
        fetchResumes();
      } else {
        toast.error('Some resumes failed to process. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred while processing resumes.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    } finally {
      setProcessingAll(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  // Filter resumes based on active tab, search query, and date
  const filteredResumes = resumes
    .filter(resume => {
      // Tab filter
      if (activeTab === 'pending' && resume.status !== 'pending') return false;
      if (activeTab === 'processed' && resume.status !== 'reviewed') return false;

      // Date filter
      if (selectedDate) {
        const resumeDate = new Date(resume.uploadDate);
        if (
          resumeDate.getDate() !== selectedDate.getDate() ||
          resumeDate.getMonth() !== selectedDate.getMonth() ||
          resumeDate.getFullYear() !== selectedDate.getFullYear()
        ) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          resume.filename.toLowerCase().includes(query) ||
          resume.status.toLowerCase().includes(query) ||
          new Date(resume.uploadDate).toLocaleString().toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  return (
    <div className="container pb-8">
      <h1 className="text-2xl font-bold mb-6">Resumes</h1>

      <form onSubmit={handleUpload} className="mb-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            required
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                toast.success('File selected: ' + e.target.files[0].name);
              }
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {fileInputRef.current?.files?.[0]?.name || "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, or DOCX (max. 10MB)
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button 
            type="submit" 
            disabled={uploading || !fileInputRef.current?.files?.[0]}
            variant="default"
            className="w-full"
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All Resumes</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processed">Processed</TabsTrigger>
              </TabsList>
            </Tabs>
            {activeTab === 'pending' && resumes.some(r => r.status === 'pending') && (
              <Button
                onClick={handleProcessAll}
                disabled={processingAll}
                variant="default"
                className="h-9 ml-2 bg-primary hover:bg-primary/90 text-white"
              >
                {processingAll ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Process All
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8"
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Cards
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by filename, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 min-w-[120px] max-w-[180px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {selectedDate ? format(selectedDate, "PPP") : "Pick date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(undefined)}
              className="h-9 px-2 hover:bg-destructive/10 hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? 'No resumes found matching your search.' : 'No resumes found.'}
        </div>
      ) : viewMode === 'table' ? (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Filename</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Uploaded</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResumes.map((resume) => (
                <tr key={resume._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm">{resume.filename}</td>
                  <td className="px-4 py-3 text-sm">{(resume.size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(resume.uploadDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${resume.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {resume.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdate(resume._id, resume.status === 'pending' ? 'reviewed' : 'pending')}
                        className="h-8"
                      >
                        {resume.status === 'pending' ? 'Mark Reviewed' : 'Mark Pending'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(resume._id)}
                        className="h-8"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume._id}
              className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold tracking-tight">{resume.filename}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(resume.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${resume.status === 'pending' 
                      ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                      : 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                    {resume.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {new Date(resume.uploadDate).toLocaleString()}
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(resume._id, resume.status === 'pending' ? 'reviewed' : 'pending')}
                    className="w-full h-9 font-medium"
                  >
                    {resume.status === 'pending' ? 'Mark Reviewed' : 'Mark Pending'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(resume._id)}
                    className="w-full h-9 font-medium"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 