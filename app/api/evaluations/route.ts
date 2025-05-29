import { NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    console.log('Connected to database successfully');

    // Fetch all evaluations
    const evaluations = await CandidateEvaluation.find()
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