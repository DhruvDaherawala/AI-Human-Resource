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
  name: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  skills: [{ type: String, required: true }],
  education: { type: String, required: true },
  currentRole: { type: String },
  currentCompany: { type: String },
  matchScore: { type: Number, required: true },
  recommendation: {
    type: String,
    enum: ["Not Recommended", "Recommended", "Strongly Recommended"],
    required: true
  },
  skillAnalysis: { type: String, required: true },
  experienceEvaluation: { type: String, required: true },
  educationEvaluation: { type: String, required: true },
  reasoning: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  manualStatus: {
    type: String,
    enum: ["shortlisted", "rejected", null],
    default: null
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.CandidateEvaluation || mongoose.model('CandidateEvaluation', CandidateEvaluationSchema); 