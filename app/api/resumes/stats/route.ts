import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Resume from '@/models/Resume';
import CandidateEvaluation from '@/models/CandidateEvaluation';

const getDateFilter = (range: string | null, dateField: string) => {
    if (!range || range === 'all') {
      return {};
    }
  
    const now = new Date();
    let startDate;
  
    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7d':
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        return {};
    }
  
    return { [dateField]: { $gte: startDate } };
};

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range');

    const resumeDateFilter = getDateFilter(range, 'createdAt');
    const evaluationDateFilter = getDateFilter(range, 'metadata.createdAt');


    // Get total resumes uploaded
    const totalResumes = await Resume.countDocuments(resumeDateFilter);

    // Get total evaluations (candidates matched with jobs)
    const totalEvaluations = await CandidateEvaluation.countDocuments(evaluationDateFilter);

    // Get resumes by status
    const pendingResumes = await Resume.countDocuments({ ...resumeDateFilter, status: 'pending' });
    const reviewedResumes = await Resume.countDocuments({ ...resumeDateFilter, status: 'reviewed' });

    // Get evaluations by recommendation
    const stronglyRecommended = await CandidateEvaluation.countDocuments({
      ...evaluationDateFilter,
      'evaluation.recommendation': 'Strongly Recommended'
    });
    const recommended = await CandidateEvaluation.countDocuments({
      ...evaluationDateFilter,
      'evaluation.recommendation': 'Recommended'
    });
    const notRecommended = await CandidateEvaluation.countDocuments({
      ...evaluationDateFilter,
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