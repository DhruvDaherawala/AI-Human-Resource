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
  // Basic Information
  name: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Skills and Education
  skills: [{ type: String, required: true }],
  education: { type: String, required: true },
  currentRole: { type: String },
  currentCompany: { type: String },
  
  // AI Evaluation Results
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
  
  // Detailed AI Analysis
  skillAnalysis: { 
    type: String, 
    required: true 
  },
  experienceEvaluation: { 
    type: String, 
    required: true 
  },
  educationEvaluation: { 
    type: String, 
    required: true 
  },
  reasoning: { 
    type: String, 
    required: true 
  },
  
  // AI Evaluation Metadata
  aiEvaluationMetadata: {
    modelUsed: { type: String, required: true },
    confidenceScore: { 
      type: Number, 
      required: true,
      min: 0,
      max: 1
    },
    processingTime: { type: Number },
    tokensUsed: { type: Number },
    evaluationDate: { type: Date, default: Date.now }
  },
  
  // Detailed Skill Matching
  skillMatchDetails: [{
    skill: { type: String, required: true },
    relevance: { type: Number, required: true, min: 0, max: 1 },
    matchLevel: {
      type: String,
      enum: ["exact", "partial", "related", "none"],
      required: true
    },
    notes: { type: String }
  }],
  
  // Experience Match Details
  experienceMatchDetails: {
    yearsOfExperience: { type: Number },
    industryMatch: { type: Number, min: 0, max: 1 },
    roleMatch: { type: Number, min: 0, max: 1 },
    keyAchievements: [{ type: String }]
  },
  
  // Status Fields
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