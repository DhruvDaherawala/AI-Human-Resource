import { Schema, model, models } from 'mongoose';

// TypeScript interface for Resume document
export interface IResume {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  uploadDate: Date;
  status: 'pending' | 'reviewed';
  processingStatus?: string;
}

// Mongoose schema definition
const resumeSchema = new Schema<IResume>({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
  },
  contentType: {
    type: String,
    required: [true, 'Content type is required'],
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
  },
  data: {
    type: Buffer,
    required: [true, 'File data is required'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed'],
    default: 'pending',
  },
  processingStatus: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create and export the Resume model
// Use existing model if it exists, otherwise create a new one
const Resume = models.Resume || model<IResume>('Resume', resumeSchema);

export default Resume; 