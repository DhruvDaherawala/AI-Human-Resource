import { NextResponse } from 'next/server';
import CandidateEvaluation from '@/models/CandidateEvaluation';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { status } = await request.json();

    if (!status || !['shortlisted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either "shortlisted" or "rejected"' },
        { status: 400 }
      );
    }

    const evaluation = await CandidateEvaluation.findByIdAndUpdate(
      params.id,
      { 'metadata.manualStatus': status },
      { new: true }
    );

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // Populate job title
    const job = await Job.findById(evaluation.jobId);
    const evaluationObj = evaluation.toObject();
    evaluationObj.jobTitle = job ? job.title : '';

    return NextResponse.json(evaluationObj);
  } catch (error) {
    console.error('Error updating evaluation status:', error);
    return NextResponse.json(
      { error: 'Failed to update evaluation status' },
      { status: 500 }
    );
  }
} 