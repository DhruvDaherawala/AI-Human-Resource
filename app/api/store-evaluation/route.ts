import { NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    console.log('Connected to database successfully');
    
    // Parse request body
    const evaluationData = await request.json();
    console.log('Received evaluation data:', JSON.stringify(evaluationData, null, 2));
    
    // Validate required fields
    if (!evaluationData.resumeId || !evaluationData.jobId) {
      console.error('Missing required fields:', {
        resumeId: evaluationData.resumeId,
        jobId: evaluationData.jobId
      });
      throw new Error('Missing required fields: resumeId and jobId are required');
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(evaluationData.resumeId)) {
      console.error('Invalid resumeId format:', evaluationData.resumeId);
      throw new Error('Invalid resumeId format');
    }
    if (!mongoose.Types.ObjectId.isValid(evaluationData.jobId)) {
      console.error('Invalid jobId format:', evaluationData.jobId);
      throw new Error('Invalid jobId format');
    }
    
    // Log the raw evaluation data
    console.log('Raw evaluation data:', {
      candidateInfo: evaluationData.candidateInfo,
      qualifications: evaluationData.qualifications,
      evaluation: evaluationData.evaluation,
      analysis: evaluationData.analysis
    });

    // Validate and transform candidate info
    if (!evaluationData.candidateInfo) {
      console.error('Missing candidateInfo in evaluation data');
      throw new Error('Missing candidateInfo in evaluation data');
    }

    const candidateInfo = {
      name: evaluationData.candidateInfo.name || 'Unknown',
      location: evaluationData.candidateInfo.location || 'Unknown',
      email: evaluationData.candidateInfo.email || 'Unknown',
      phone: evaluationData.candidateInfo.phone || 'Unknown'
    };
      
    // Validate and transform qualifications
    if (!evaluationData.qualifications) {
      console.error('Missing qualifications in evaluation data');
      throw new Error('Missing qualifications in evaluation data');
    }

    const qualifications = {
      skills: Array.isArray(evaluationData.qualifications.skills) ? evaluationData.qualifications.skills : [],
      education: evaluationData.qualifications.education || 'Unknown',
      currentRole: evaluationData.qualifications.currentRole || 'Unknown',
      currentCompany: evaluationData.qualifications.currentCompany || 'Unknown'
    };

    // Validate and transform evaluation
    if (!evaluationData.evaluation) {
      console.error('Missing evaluation in evaluation data');
      throw new Error('Missing evaluation in evaluation data');
    }

    const evaluation = {
      matchScore: typeof evaluationData.evaluation.matchScore === 'number' 
        ? Math.min(Math.max(evaluationData.evaluation.matchScore, 0), 100) 
        : 0,
      recommendation: ['Not Recommended', 'Recommended', 'Strongly Recommended'].includes(evaluationData.evaluation.recommendation) 
        ? evaluationData.evaluation.recommendation 
        : 'Not Recommended',
      skillAnalysis: {
        matchingSkills: Array.isArray(evaluationData.evaluation.skillAnalysis?.matchingSkills) 
          ? evaluationData.evaluation.skillAnalysis.matchingSkills 
          : [],
        missingSkills: Array.isArray(evaluationData.evaluation.skillAnalysis?.missingSkills) 
          ? evaluationData.evaluation.skillAnalysis.missingSkills 
          : [],
        skillGap: evaluationData.evaluation.skillAnalysis?.skillGap || ''
      },
      experienceEvaluation: {
        relevance: evaluationData.evaluation.experienceEvaluation?.relevance || '',
        yearsOfExperience: typeof evaluationData.evaluation.experienceEvaluation?.yearsOfExperience === 'number' 
          ? evaluationData.evaluation.experienceEvaluation.yearsOfExperience 
          : 0,
        keyAchievements: Array.isArray(evaluationData.evaluation.experienceEvaluation?.keyAchievements) 
          ? evaluationData.evaluation.experienceEvaluation.keyAchievements 
          : []
      },
      educationEvaluation: {
        relevance: evaluationData.evaluation.educationEvaluation?.relevance || '',
        qualificationMatch: evaluationData.evaluation.educationEvaluation?.qualificationMatch || ''
      }
    };

    // Validate and transform analysis
    if (!evaluationData.analysis) {
      console.error('Missing analysis in evaluation data');
      throw new Error('Missing analysis in evaluation data');
    }

    const analysis = {
      strengths: Array.isArray(evaluationData.analysis.strengths) ? evaluationData.analysis.strengths : [],
      weaknesses: Array.isArray(evaluationData.analysis.weaknesses) ? evaluationData.analysis.weaknesses : [],
      reasoning: evaluationData.analysis.reasoning || ''
    };

    // Add AI evaluation metadata
    const aiEvaluationMetadata = {
      confidenceScore: 0.85, // Default confidence score
      modelUsed: "gemini-pro", // Default model used
      processingTime: evaluationData.processingTime || 0,
      timestamp: new Date()
    };

    // Log the transformed data
    console.log('Transformed data:', {
      candidateInfo,
      qualifications,
      evaluation,
      analysis,
      aiEvaluationMetadata
    });

    // Create new evaluation document
    const candidateEvaluation = new CandidateEvaluation({
      resumeId: new mongoose.Types.ObjectId(evaluationData.resumeId),
      jobId: new mongoose.Types.ObjectId(evaluationData.jobId),
      candidateInfo,
      qualifications,
      evaluation,
      analysis,
      aiEvaluationMetadata,
      metadata: {
        status: "completed",
        manualStatus: null,
        createdAt: new Date()
      }
    });

    // Save the evaluation
    console.log('Saving evaluation to database...');
    try {
    await candidateEvaluation.save();
    console.log('Evaluation saved successfully');
    } catch (saveError) {
      console.error('Error during save operation:', saveError);
      if (saveError instanceof Error) {
        console.error('Validation errors:', (saveError as any).errors);
        console.error('Full error details:', {
          name: saveError.name,
          message: saveError.message,
          stack: saveError.stack,
          errors: (saveError as any).errors
        });
      }
      throw saveError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Evaluation stored successfully',
      evaluationId: candidateEvaluation._id 
    });
  } catch (error) {
    console.error('Error storing evaluation:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      if ('errors' in error) {
        console.error('Validation errors:', (error as any).errors);
      }
    }
    
    // Return detailed error response
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to store evaluation',
        details: error instanceof Error ? error.stack : undefined,
        validationErrors: error instanceof Error && 'errors' in error ? (error as any).errors : undefined
      },
      { status: 500 }
    );
  }
} 