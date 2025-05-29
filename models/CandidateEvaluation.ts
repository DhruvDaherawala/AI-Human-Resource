import mongoose from 'mongoose';

const CandidateEvaluationSchema = new mongoose.Schema({
  resumeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume',
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job',
    required: true 
  },
  
  // Candidate Information
  candidateInfo: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Qualifications
  qualifications: {
    skills: [{ type: String, required: true }],
    education: { type: String, required: true },
    currentRole: { type: String },
    currentCompany: { type: String }
  },
  
  // Evaluation Results
  evaluation: {
    matchScore: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    recommendation: {
      type: String,
      enum: ["Not Recommended", "Recommended", "Strongly Recommended"],
      required: true
    },
    skillAnalysis: {
      matchingSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      skillGap: { type: String }
    },
    experienceEvaluation: {
      relevance: { type: String },
      yearsOfExperience: { type: Number },
      keyAchievements: [{ type: String }]
    },
    educationEvaluation: {
      relevance: { type: String },
      qualificationMatch: { type: String }
    }
  },
  
  // Analysis
  analysis: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    reasoning: { type: String }
  },
  
  // Metadata
  metadata: {
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    manualStatus: {
      type: String,
      enum: ["shortlisted", "rejected", null],
      default: null
    },
    createdAt: { type: Date, default: Date.now }
  },
  
  // Error handling
  error: {
    type: String
  },
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for faster queries
CandidateEvaluationSchema.index({ resumeId: 1, jobId: 1 });
CandidateEvaluationSchema.index({ status: 1, manualStatus: 1 });

export default mongoose.models.CandidateEvaluation || mongoose.model('CandidateEvaluation', CandidateEvaluationSchema); 