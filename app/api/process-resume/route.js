import { NextResponse } from "next/server"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const jobId = formData.get("jobId")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract text from PDF (simulated)
    const pdfText = await extractTextFromPDF(file)

    // Process the resume with Grok
    const resumeData = await processResumeWithML(pdfText)

    // If a job ID was provided, match the candidate to that job
    let matchResult = null
    if (jobId) {
      // In a real app, you would fetch the job requirements from your database
      const jobRequirements = {
        title: "Software Engineer",
        description: "We're looking for a skilled software engineer...",
        requirements: "5+ years of experience in web development...",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        experience: "5+ years",
        education: "Bachelor's in Computer Science or related field",
      }

      matchResult = await evaluateCandidateMatch(resumeData, jobRequirements)
    }

    return NextResponse.json({
      success: true,
      data: resumeData,
      match: matchResult,
    })
  } catch (error) {
    console.error("Error processing resume:", error)
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 })
  }
}

// Simulated function to extract text from PDF
async function extractTextFromPDF(file) {
  // This is a placeholder for actual PDF text extraction
  // In a real implementation, you would use a PDF parsing library

  // For demo purposes, we'll return a sample resume text
  return `
John Doe
Software Engineer
john.doe@example.com
(555) 123-4567
San Francisco, CA

Professional Summary:
Experienced software engineer with 7+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions and leading development teams.

Skills:
JavaScript, TypeScript, React, Node.js, Express, MongoDB, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Git

Experience:
Senior Software Engineer | Tech Solutions Inc. | 2020 - Present
- Led development of cloud-based SaaS products
- Managed a team of 5 engineers
- Implemented microservices architecture
- Reduced system latency by 40%

Software Engineer | WebDev Co. | 2017 - 2020
- Developed and maintained multiple web applications
- Implemented responsive UI designs
- Collaborated with cross-functional teams
- Improved application performance by 30%

Education:
M.S. Computer Science | Stanford University | 2017
B.S. Computer Science | UC Berkeley | 2015
`
}

// Process resume text with Grok ML
async function processResumeWithML(pdfText) {
  try {
    const prompt = `
You are an expert HR assistant that extracts structured information from resumes.
Extract the following information from this resume text:
- Full name
- Email address
- Phone number
- Location
- Current role/title
- Current company
- Professional summary
- Skills (as an array)
- Work experience (as an array of objects with title, company, duration, and description)
- Education (as an array of objects with degree, institution, and year)

Format the output as a valid JSON object with these fields:
name, email, phone, location, currentRole, company, summary, skills, experience, education.

Resume text:
${pdfText}
`

    const { text } = await generateText({
      model: xai("grok-3-beta"),
      prompt,
      temperature: 0.2, // Lower temperature for more consistent, factual responses
    })

    // Parse the JSON response
    try {
      const resumeData = JSON.parse(text)
      return resumeData
    } catch (parseError) {
      console.error("Failed to parse ML response as JSON:", parseError)
      // Extract JSON from text if the response contains additional text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error("Could not extract valid JSON from ML response")
    }
  } catch (error) {
    console.error("Error processing resume with ML:", error)
    throw error
  }
}

// Evaluate candidate match against job requirements
async function evaluateCandidateMatch(candidate, jobRequirements) {
  try {
    const prompt = `
You are an expert HR assistant that evaluates how well candidates match job requirements.
Analyze this candidate profile against the job requirements and provide a detailed evaluation.

Job Requirements:
Title: ${jobRequirements.title}
Description: ${jobRequirements.description}
Required Skills: ${jobRequirements.skills.join(", ")}
Required Experience: ${jobRequirements.experience}
Required Education: ${jobRequirements.education}

Candidate Profile:
Name: ${candidate.name}
Current Role: ${candidate.currentRole || "Not specified"}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience.map((exp) => `${exp.title} at ${exp.company} (${exp.duration})`).join("; ")}
Education: ${candidate.education.map((edu) => `${edu.degree} from ${edu.institution} (${edu.year})`).join("; ")}
Summary: ${candidate.summary}

Provide a detailed evaluation with the following:
1. Overall match score (0-100)
2. Skills match analysis (which skills match and which are missing)
3. Experience evaluation (is the experience sufficient and relevant)
4. Education evaluation (does the education meet requirements)
5. Recommendation (Strongly Recommend, Recommend, Maybe, Not Recommended)

Format the output as a valid JSON object with these fields:
score, skillsAnalysis, experienceEvaluation, educationEvaluation, recommendation, reasoning.
`

    const { text } = await generateText({
      model: xai("grok-3-beta"),
      prompt,
      temperature: 0.3,
    })

    // Parse the JSON response
    try {
      const matchResult = JSON.parse(text)
      return matchResult
    } catch (parseError) {
      console.error("Failed to parse ML match evaluation as JSON:", parseError)
      // Extract JSON from text if the response contains additional text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error("Could not extract valid JSON from ML response")
    }
  } catch (error) {
    console.error("Error evaluating candidate match with ML:", error)
    throw error
  }
}
