"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

export function FileUploader({
  onFileSelect,
  accept = ".pdf",
  multiple = true,
  maxSize = 10, // 10MB default
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const processFiles = (files) => {
    // Filter by file type if accept is specified
    const filteredByType = accept
      ? files.filter((file) => {
          const fileTypes = accept.split(",").map((type) => type.trim())
          return fileTypes.some((type) => {
            if (type.startsWith(".")) {
              return file.name.toLowerCase().endsWith(type.toLowerCase())
            } else {
              return file.type === type
            }
          })
        })
      : files

    // Filter by file size
    const maxSizeBytes = maxSize * 1024 * 1024 // Convert MB to bytes
    const filteredBySize = filteredByType.filter((file) => file.size <= maxSizeBytes)

    // If some files were filtered out, you could show a warning here
    if (filteredByType.length !== files.length || filteredBySize.length !== filteredByType.length) {
      console.warn("Some files were filtered out due to invalid type or size")
    }

    onFileSelect(multiple ? filteredBySize : [filteredBySize[0]])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={disabled ? undefined : handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Upload Resumes</h3>
        <p className="text-sm text-muted-foreground max-w-xs">Drag and drop PDF files here, or click to browse</p>
        <p className="text-xs text-muted-foreground">Maximum file size: {maxSize}MB</p>
      </div>
    </div>
  )
}
