import { NextRequest, NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import { connectToDatabase } from '@/lib/mongodb';

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
    // Connect to database
    await connectToDatabase();
    console.log('Connected to database successfully');

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range');
    const dateFilter = getDateFilter(range, 'metadata.createdAt');

    // Fetch all evaluations
    const evaluations = await CandidateEvaluation.find(dateFilter)
      .sort({ 'metadata.createdAt': -1 }) // Sort by creation date, newest first
      .lean();

    console.log(`Found ${evaluations.length} evaluations`);

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
} 