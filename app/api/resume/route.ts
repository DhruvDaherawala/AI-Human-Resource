import { NextResponse } from "next/server";
import Resume from "@/models/Resume";
import connectDB from "@/lib/mongodb";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Fetching resumes...');
    
    // Add error handling for the find operation
    const resumes = await Resume.find({}, {
      filename: 1,
      size: 1,
      uploadDate: 1,
      status: 1,
      processingStatus: 1,
      _id: 1
    }).sort({ uploadDate: -1 }).lean();
    
    if (!resumes) {
      console.log('No resumes found');
      return NextResponse.json([]);
    }
    
    console.log(`Found ${resumes.length} resumes`);
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error in GET /api/resume:', error);
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Error fetching resumes', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File size exceeds limit:', file.size);
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word documents only.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create new resume document
    const resume = new Resume({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      data: buffer,
      status: 'pending'
    });

    // Save to database with validation
    console.log('Saving resume to database...');
    const result = await resume.save();
    console.log('Resume saved successfully:', result._id);

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      fileId: result._id
    });

  } catch (error) {
    console.error('Error in POST /api/resume:', error);
    return NextResponse.json(
      { 
        error: "Error uploading resume", 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500 }
    );
  }
}