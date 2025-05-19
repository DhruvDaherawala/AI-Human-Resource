"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { uploadResumes } from "../actions"

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState(null)
  const router = useRouter()

  const handleFileChange = (selectedFiles) => {
    // Filter only PDF files
    const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")
    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
  }

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProcessingStatus("Uploading files...")

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 50) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      // Upload files
      await uploadResumes(files)

      clearInterval(interval)
      setUploadProgress(50)
      setProcessingStatus("Processing resumes with AI...")

      // Process each file with ML
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        // Update progress for each file
        setProcessingStatus(`Processing resume ${i + 1} of ${files.length}...`)
        setUploadProgress(50 + Math.floor((i / files.length) * 50))

        // Call the API to process the resume
        const response = await fetch("/api/process-resume", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to process resume: ${file.name}`)
        }
      }

      setUploadProgress(100)
      setProcessingStatus("Processing complete!")

      // Redirect to processing page after successful upload
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Upload failed:", error)
      setProcessingStatus(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Resumes</CardTitle>
          <CardDescription>
            Upload PDF resumes to analyze and shortlist candidates using our AI. You can upload multiple files at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            onFileSelect={handleFileChange}
            accept=".pdf"
            multiple={true}
            maxSize={10} // 10MB
            disabled={uploading}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uploading && (
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {processingStatus} ({uploadProgress}%)
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? "Processing..." : "Upload & Process Resumes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
