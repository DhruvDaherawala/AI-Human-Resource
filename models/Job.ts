import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  requirements: {
    type: [String],
    required: [true, 'Job requirements are required'],
    default: []
  },
  salary: {
    type: String,
    required: [true, 'Salary information is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create and export the Job model
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job; 