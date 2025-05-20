import { NextResponse } from "next/server";
import Resume from "@/models/Resume";
import connectDB from "@/lib/mongodb";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
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

    // Create new resume document
    const resume = new Resume({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      data: buffer,
      status: 'pending'
    });

    // Save to database
    const result = await resume.save();

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      fileId: result._id
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: "Error uploading resume" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const resumes = await Resume.find({}, {
      filename: 1,
      size: 1,
      uploadDate: 1,
      status: 1,
      processingStatus: 1,
      _id: 1
    }).sort({ uploadDate: -1 });
    
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Error fetching resumes' },
      { status: 500 }
    );
  }
}