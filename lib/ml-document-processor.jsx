import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

/**
 * Processes a PDF document using ML to extract structured information
 * @param {string} pdfText - The text content extracted from a PDF
 * @returns {Promise<Object>} Structured resume data
 */
export async function processResumeWithML(pdfText) {
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

/**
 * Evaluates a candidate against job requirements using ML
 * @param {Object} candidate - The candidate profile data
 * @param {Object} jobRequirements - The job requirements
 * @returns {Promise<Object>} Match evaluation results
 */
export async function evaluateCandidateMatch(candidate, jobRequirements) {
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
