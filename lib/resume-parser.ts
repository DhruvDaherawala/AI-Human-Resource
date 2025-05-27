import { extractTextFromBase64PDF } from './pdf-parser';

interface ResumeDocument {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  status: string;
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export async function parseResumeDocument(resumeDoc: ResumeDocument): Promise<string> {
  try {
    console.log('📄 Processing resume:', resumeDoc.filename);
    
    // Convert Buffer to base64 string with proper data URL prefix
    const base64Data = `data:${resumeDoc.contentType};base64,${resumeDoc.data.toString('base64')}`;
    console.log('Converted Buffer to base64 with content type:', resumeDoc.contentType);
    
    // Extract text from the PDF
    const extractedText = await extractTextFromBase64PDF(base64Data);
    console.log('Successfully extracted text from PDF');
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content extracted from PDF');
    }
    
    return extractedText;
  } catch (error) {
    console.error('❌ Error parsing resume:', error);
    throw new Error(`Failed to parse resume: ${resumeDoc.filename} - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility function to parse multiple resumes
export async function parseMultipleResumes(resumeDocs: ResumeDocument[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  for (const doc of resumeDocs) {
    try {
      const text = await parseResumeDocument(doc);
      results.set(doc._id, text);
    } catch (error) {
      console.error(`Failed to parse resume ${doc.filename}:`, error);
      results.set(doc._id, ''); // Set empty string for failed parses
    }
  }
  
  return results;
} 