'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch resumes
  const fetchResumes = async () => {
    setLoading(true);
    const res = await fetch('/api/resume');
    const data = await res.json();
    setResumes(data);
    setLoading(false);
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
    const res = await fetch('/api/resume', {
      method: 'POST',
      body: formData,
    });
    setUploading(false);
    if (res.ok) {
      fetchResumes();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert('Upload failed');
    }
  };

  // Delete resume
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
    if (res.ok) fetchResumes();
    else alert('Delete failed');
  };

  // Update resume status (example: mark as reviewed)
  const handleUpdate = async (id: string, status: string) => {
    const res = await fetch(`/api/resume/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchResumes();
    else alert('Update failed');
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Resumes</h1>
      <form onSubmit={handleUpload} className="flex gap-4 mb-8">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          required
          className="border rounded px-2 py-1"
        />
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : resumes.length === 0 ? (
        <div>No resumes found.</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Filename</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Uploaded</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume._id}>
                <td className="border px-2 py-1">{resume.filename}</td>
                <td className="border px-2 py-1">{(resume.size / 1024).toFixed(1)} KB</td>
                <td className="border px-2 py-1">
                  {new Date(resume.uploadDate).toLocaleString()}
                </td>
                <td className="border px-2 py-1">{resume.status}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(resume._id, resume.status === 'pending' ? 'reviewed' : 'pending')}
                  >
                    Mark as {resume.status === 'pending' ? 'Reviewed' : 'Pending'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(resume._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
