"use server"

/**
 * Uploads and processes resume files
 * @param {Array} files - Array of resume files to upload
 * @returns {Promise<Object>} Upload result
 */
export async function uploadResumes(files) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:3000`;
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${baseUrl}/api/resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
    }

    return { success: true, count: files.length };
  } catch (error) {
    console.error("Error uploading resumes:", error);
    throw new Error("Failed to upload resumes");
  }
}
