import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;

if (!GOOGLE_AI_KEY) {
  console.error('GOOGLE_AI_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GOOGLE_AI_KEY || '');

export async function evaluateResumeWithAI(resumeText: string, jobDescription: string, jobRequirements: string) {
  try {
    if (!GOOGLE_AI_KEY) {
      throw new Error('Google AI API key is not configured');
    }

    // Use gemini-pro model for text generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


    const prompt = `
You are an expert AI HR assistant evaluating resumes for job applications. Analyze the following resume against the job description and requirements.

Given the following resume and job details, provide a comprehensive evaluation in JSON format with the following structure:

{
  "candidateInfo": {
    "name": "string",
    "location": "string",
    "email": "string",
    "phone": "string"
  },
  "qualifications": {
    "skills": ["string"],
    "education": "string",
    "currentRole": "string",
    "currentCompany": "string"
  },
  "evaluation": {
    "matchScore": number, // 0-100
    "recommendation": "Not Recommended" | "Recommended" | "Strongly Recommended",
    "skillAnalysis": {
      "matchingSkills": ["string"],
      "missingSkills": ["string"],
      "skillGap": "string"
    },
    "experienceEvaluation": {
      "relevance": "string",
      "yearsOfExperience": number,
      "keyAchievements": ["string"]
    },
    "educationEvaluation": {
      "relevance": "string",
      "qualificationMatch": "string"
    }
  },
  "analysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "reasoning": "string"
  },
  "metadata": {
    "status": "pending",
    "manualStatus": null,
    "createdAt": "ISO timestamp"
  }
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Job Requirements:
${jobRequirements}

Please provide a detailed evaluation focusing on:
1. Skill match and gaps
2. Experience relevance
3. Education alignment
4. Overall fit for the role
5. Specific strengths and areas for improvement

IMPORTANT: Your response must be a valid JSON object matching the structure above. Do not include any additional text or explanations outside the JSON structure.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to ensure it's valid JSON
    try {
      // Try to extract JSON from the response if there's any additional text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      
      const evaluation = JSON.parse(jsonText);
      
      // Validate the evaluation structure
      if (!evaluation.candidateInfo || !evaluation.qualifications || !evaluation.evaluation) {
        throw new Error('Invalid evaluation structure');
      }
      
      return evaluation;
    } catch (error) {
      console.error('Error parsing AI evaluation response:', error);
      console.error('Raw response:', text);
      throw new Error(`Failed to parse AI evaluation response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    if (error instanceof Error) {
      throw new Error(`AI evaluation failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during AI evaluation');
  }
} 