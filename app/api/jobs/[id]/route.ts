import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET single job
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('AI-HR');
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      console.error('Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });
    
    if (!job) {
      console.error('Job not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT (update) job
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Update request received for job ID:', params.id);
    
    const client = await clientPromise;
    const db = client.db('AI-HR');
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      console.error('Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log('Update data received:', data);
    
    // First check if the job exists
    const existingJob = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });
    
    if (!existingJob) {
      console.error('Job not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    console.log('Existing job found:', existingJob);

    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Remove _id from update data if it exists
    delete updateData._id;

    console.log('Prepared update data:', updateData);

    // Perform the update using updateOne instead of findOneAndUpdate
    const updateResult = await db.collection('jobs').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('Update result:', updateResult);

    if (updateResult.matchedCount === 0) {
      console.error('No job found to update with ID:', params.id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (updateResult.modifiedCount === 0) {
      console.error('No changes made to job with ID:', params.id);
      return NextResponse.json(
        { error: 'No changes were made to the job' },
        { status: 400 }
      );
    }

    // Fetch the updated document
    const updatedJob = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });
    
    if (!updatedJob) {
      console.error('Failed to fetch updated job with ID:', params.id);
      return NextResponse.json(
        { error: 'Failed to fetch updated job' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      console.error('Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('AI-HR');
    
    // First check if the job exists
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });
    
    if (!job) {
      console.error('Job not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Then delete it
    const deleteResult = await db.collection('jobs').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (deleteResult.deletedCount === 0) {
      console.error('Failed to delete job with ID:', params.id);
      return NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Job deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 