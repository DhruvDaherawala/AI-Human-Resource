"use server"

import { revalidatePath } from "next/cache"

/**
 * Uploads and processes resume files
 * @param {Array} files - Array of resume files to upload
 * @returns {Promise<Object>} Upload result
 */
export async function uploadResumes(files) {
  try {
    // Upload each file to /api/resume
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })
    }
    return { success: true, count: files.length }
  } catch (error) {
    console.error("Error uploading resumes:", error)
    throw new Error("Failed to upload resumes")
  }
}

/**
 * Creates a new job posting
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} Job creation result
 */
export async function createJob(jobData) {
  try {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    })
    if (!res.ok) throw new Error('Failed to create job')
    const data = await res.json()
    return { success: true, jobId: data.jobId }
  } catch (error) {
    console.error("Error creating job:", error)
    throw new Error("Failed to create job")
  }
}

/**
 * Updates an existing job posting
 * @param {string} id - Job ID
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} Job update result
 */
export async function updateJob(id, jobData) {
  try {
    const res = await fetch('/api/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...jobData }),
    })
    if (!res.ok) throw new Error('Failed to update job')
    return { success: true }
  } catch (error) {
    console.error("Error updating job:", error)
    throw new Error("Failed to update job")
  }
}

/**
 * Deletes a job posting
 * @param {string} id - Job ID
 * @returns {Promise<Object>} Job deletion result
 */
export async function deleteJob(id) {
  try {
    const res = await fetch('/api/jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error('Failed to delete job')
    return { success: true }
  } catch (error) {
    console.error("Error deleting job:", error)
    throw new Error("Failed to delete job")
  }
}
