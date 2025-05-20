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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

type Resume = {
  _id: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: string;
  processingStatus?: string;
};

type UploadProgress = {
  filename: string;
  progress: number;
  status: 'preparing' | 'uploading' | 'complete' | 'error';
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingAll, setProcessingAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

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
    if (!fileInputRef.current?.files?.length) return;
    
    const files = Array.from(fileInputRef.current.files);
    setUploading(true);
    
    // Initialize progress for each file
    setUploadProgress(files.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'preparing'
    })));

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);

        // Update status to uploading
        setUploadProgress(prev => prev.map((p, i) => 
          i === index ? { ...p, status: 'uploading' } : p
        ));

        const res = await fetch('/api/resume', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          // Update progress to complete
          setUploadProgress(prev => prev.map((p, i) => 
            i === index ? { ...p, progress: 100, status: 'complete' } : p
          ));
          return true;
        } else {
          // Update progress to error
          setUploadProgress(prev => prev.map((p, i) => 
            i === index ? { ...p, status: 'error' } : p
          ));
          return false;
        }
      });

      const results = await Promise.all(uploadPromises);
      const allSuccessful = results.every(Boolean);

      if (allSuccessful) {
        toast.success('All resumes uploaded successfully!', {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
      } else {
        toast.error('Some files failed to upload. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }

      fetchResumes();
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      // Clear progress after 3 seconds
      setTimeout(() => setUploadProgress([]), 3000);
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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResumes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Delete all resumes
  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const promises = resumes.map(resume => 
        fetch(`/api/resume/${resume._id}`, { method: 'DELETE' })
      );

      const results = await Promise.all(promises);
      const allSuccessful = results.every(res => res.ok);

      if (allSuccessful) {
        toast.success('All resumes deleted successfully!', {
          style: {
            background: '#DCFCE7',
            color: '#166534',
            border: '1px solid #86EFAC'
          }
        });
        fetchResumes();
      } else {
        toast.error('Some resumes failed to delete. Please try again.', {
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred while deleting resumes.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      });
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="container pb-8">
      <h1 className="text-2xl font-bold mb-6">Resumes</h1>

      <div className="flex flex-col gap-6 mb-6">
        {/* File Upload Section */}
        <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6">
          <form onSubmit={handleUpload}>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {fileInputRef.current?.files?.length 
                      ? `${fileInputRef.current.files.length} file(s) selected`
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, or DOCX (max. 10MB per file)
                  </p>
                </div>
                {fileInputRef.current?.files && fileInputRef.current.files.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {Array.from(fileInputRef.current.files).map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setUploadProgress(Array.from(e.target.files).map(file => ({
                    filename: file.name,
                    progress: 0,
                    status: 'preparing'
                  })));
                }
              }}
            />
            <div className="mt-4 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                    setUploadProgress([]);
                  }
                }}
                disabled={!fileInputRef.current?.files?.length}
                className="flex items-center gap-2"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={uploading || !fileInputRef.current?.files?.length}
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-4">
              {uploadProgress.map((progress, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-48 truncate text-sm font-medium">{progress.filename}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          progress.status === 'error' ? 'bg-red-500' : 'bg-primary'
                        )}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm">
                    {progress.status === 'preparing' && (
                      <span className="text-yellow-600">Preparing...</span>
                    )}
                    {progress.status === 'uploading' && (
                      <span className="text-blue-600">Uploading...</span>
                    )}
                    {progress.status === 'complete' && (
                      <span className="text-green-600">Complete</span>
                    )}
                    {progress.status === 'error' && (
                      <span className="text-red-600">Error</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="all">All Resumes</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processed">Processed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'pending' && resumes.some(r => r.status === 'pending') && (
                <Button
                  onClick={handleProcessAll}
                  disabled={processingAll}
                  variant="default"
                  className="h-9 bg-primary hover:bg-primary/90 text-white"
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
              {resumes.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-9"
                      disabled={deletingAll}
                    >
                      {deletingAll ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete All
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all {resumes.length} resumes
                        from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAll}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-9"
              >
                <Table className="h-4 w-4 mr-2" />
                Table View
              </Button>
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('card')}
                className="h-9"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Card View
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
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
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">
            {searchQuery ? 'No resumes found matching your search.' : 'No resumes found.'}
          </p>
          <p className="text-sm mt-2">Upload some resumes to get started.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Filename</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Uploaded</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((resume) => (
                  <tr key={resume._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{resume.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(resume.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(resume.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        resume.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      )}>
                        {resume.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResumes.length)} of {filteredResumes.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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