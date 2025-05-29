import { NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import { connectToDatabase } from '@/lib/mongodb';

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
      throw new Error('Missing required fields: resumeId and jobId are required');
    }

    if (!evaluationData.candidateInfo || !evaluationData.qualifications || !evaluationData.evaluation) {
      throw new Error('Missing required evaluation data');
    }
    
    // Create new evaluation document
    const candidateEvaluation = new CandidateEvaluation({
      resumeId: evaluationData.resumeId,
      jobId: evaluationData.jobId,
      // Basic Information
      name: evaluationData.candidateInfo.name,
      location: evaluationData.candidateInfo.location,
      email: evaluationData.candidateInfo.email,
      phone: evaluationData.candidateInfo.phone,
      
      // Skills and Education
      skills: evaluationData.qualifications.skills,
      education: evaluationData.qualifications.education,
      currentRole: evaluationData.qualifications.currentRole,
      currentCompany: evaluationData.qualifications.currentCompany,
      
      // AI Evaluation Results
      matchScore: evaluationData.evaluation.matchScore,
      recommendation: evaluationData.evaluation.recommendation,
      
      // Detailed AI Analysis
      skillAnalysis: JSON.stringify(evaluationData.evaluation.skillAnalysis),
      experienceEvaluation: JSON.stringify(evaluationData.evaluation.experienceEvaluation),
      educationEvaluation: JSON.stringify(evaluationData.evaluation.educationEvaluation),
      reasoning: evaluationData.analysis.reasoning,
      
      // AI Evaluation Metadata
      aiEvaluationMetadata: {
        modelUsed: "gemini-2.0-flash",
        confidenceScore: 0.95,
        processingTime: evaluationData.processingTime,
        tokensUsed: evaluationData.metadata?.tokensUsed || 0,
        evaluationDate: new Date()
      },
      
      // Detailed Skill Matching
      skillMatchDetails: evaluationData.evaluation.skillAnalysis.matchingSkills.map((skill: string) => ({
        skill,
        relevance: 1.0,
        matchLevel: "exact",
        notes: "Matched skill from job requirements"
      })),
      
      // Experience Match Details
      experienceMatchDetails: {
        yearsOfExperience: evaluationData.evaluation.experienceEvaluation.yearsOfExperience,
        industryMatch: 0.8,
        roleMatch: 0.9,
        keyAchievements: evaluationData.evaluation.experienceEvaluation.keyAchievements
      },
      
      // Status
      status: "completed"
    });

    // Save the evaluation
    console.log('Saving evaluation to database...');
    await candidateEvaluation.save();
    console.log('Evaluation saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Evaluation stored successfully',
      evaluationId: candidateEvaluation._id 
    });
  } catch (error) {
    console.error('Error storing evaluation:', error);
    
    // Return detailed error response
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to store evaluation',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 