import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Resume from '@/models/Resume';
import CandidateEvaluation from '@/models/CandidateEvaluation';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get total resumes uploaded
    const totalResumes = await Resume.countDocuments();

    // Get total evaluations (candidates matched with jobs)
    const totalEvaluations = await CandidateEvaluation.countDocuments();

    // Get resumes by status
    const pendingResumes = await Resume.countDocuments({ status: 'pending' });
    const reviewedResumes = await Resume.countDocuments({ status: 'reviewed' });

    // Get evaluations by recommendation
    const stronglyRecommended = await CandidateEvaluation.countDocuments({
      'evaluation.recommendation': 'Strongly Recommended'
    });
    const recommended = await CandidateEvaluation.countDocuments({
      'evaluation.recommendation': 'Recommended'
    });
    const notRecommended = await CandidateEvaluation.countDocuments({
      'evaluation.recommendation': 'Not Recommended'
    });

    return NextResponse.json({
      totalResumes,
      totalEvaluations,
      resumeStats: {
        pending: pendingResumes,
        reviewed: reviewedResumes
      },
      evaluationStats: {
        stronglyRecommended,
        recommended,
        notRecommended
      }
    });

  } catch (error) {
    console.error('Error fetching resume stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume statistics' },
      { status: 500 }
    );
  }
} 