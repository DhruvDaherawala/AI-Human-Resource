import { NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import Job from '@/models/Job';
import { connectToDatabase } from '@/lib/mongodb';

type EvaluationDocument = {
  _id: string;
  jobId: string;
  candidateInfo: {
    name: string;
  };
  [key: string]: any;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();
    console.log('Connected to database successfully');

    // Fetch single evaluation
    const evaluation = await CandidateEvaluation.findById(params.id).lean() as unknown as EvaluationDocument;

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // Fetch the job title
    const job = await Job.findById(evaluation.jobId);
    if (job) {
      evaluation.jobTitle = job.title;
    }

    console.log('Found evaluation for candidate:', evaluation.candidateInfo.name);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
} 