import { NextResponse } from 'next/server';
import { evaluateResumeWithAI } from '@/lib/ai-evaluation';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription, jobRequirements } = await request.json();

    // Validate required fields
    if (!resumeText || !jobDescription || !jobRequirements) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            resumeText: !resumeText ? 'Missing' : 'Present',
            jobDescription: !jobDescription ? 'Missing' : 'Present',
            jobRequirements: !jobRequirements ? 'Missing' : 'Present'
          }
        },
        { status: 400 }
      );
    }

    // Validate field types
    if (typeof resumeText !== 'string' || typeof jobDescription !== 'string' || typeof jobRequirements !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid field types',
          details: {
            resumeText: typeof resumeText,
            jobDescription: typeof jobDescription,
            jobRequirements: typeof jobRequirements
          }
        },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (resumeText.trim().length === 0 || jobDescription.trim().length === 0 || jobRequirements.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Empty fields not allowed',
          details: {
            resumeText: resumeText.trim().length,
            jobDescription: jobDescription.trim().length,
            jobRequirements: jobRequirements.trim().length
          }
        },
        { status: 400 }
      );
    }

    const evaluation = await evaluateResumeWithAI(
      resumeText,
      jobDescription,
      jobRequirements
    );

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error in resume evaluation:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to evaluate resume',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500 }
    );
  }
} 