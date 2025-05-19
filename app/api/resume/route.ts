import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word documents only.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('AI-HR');
    const collection = db.collection('resume');

    // Create document with file data
    const result = await collection.insertOne({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      data: buffer,
      uploadDate: new Date(),
      status: 'pending',
      processingStatus: 'uploaded'
    });

    if (!result.acknowledged) {
      throw new Error('Failed to save file to database');
    }

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      id: result.insertedId,
      filename: file.name,
      size: file.size
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error uploading resume. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('AI-HR');
    const collection = db.collection('resume');
    
    const resumes = await collection.find({}, {
      projection: {
        filename: 1,
        size: 1,
        uploadDate: 1,
        status: 1,
        processingStatus: 1,
        _id: 1
      }
    }).toArray();
    
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Error fetching resumes' },
      { status: 500 }
    );
  }
} 