import { NextResponse } from 'next/server'
import Job from '@/models/Job'
import connectDB from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Fetching jobs...');
    const jobs = await Job.find({}).sort({ postedDate: -1 });
    console.log(`Found ${jobs.length} jobs`);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const data = await request.json();
    console.log('Creating new job:', data);
    
    const job = new Job({
      ...data,
      postedDate: new Date()
    });

    const result = await job.save();
    console.log('Job created successfully:', result._id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to create job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const { id, ...update } = await request.json();
    console.log('Updating job:', id);
    
    const result = await Job.findByIdAndUpdate(
      id,
      { 
        ...update,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!result) {
      console.log('Job not found:', id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    console.log('Job updated successfully:', id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in PUT /api/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to update job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const { id } = await request.json();
    console.log('Deleting job:', id);
    
    const result = await Job.findByIdAndDelete(id);
    
    if (!result) {
      console.log('Job not found:', id);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    console.log('Job deleted successfully:', id);
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to delete job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
