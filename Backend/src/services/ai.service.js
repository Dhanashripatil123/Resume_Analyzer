
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
require("dotenv").config();
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  title: z.string(),

  matchScore: z.number().min(0).max(100),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behaviouralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

async function generateInterviewReport({
  resume = "",
  selfDescription = "",
  jobDescription = "",
}) {

  const prompt = `
You are an expert ATS Resume Optimizer and Technical Recruiter.

Your task is to analyze both the Job Description and the Candidate Resume.

Instructions:

1. Extract all important technical skills, tools, frameworks, platforms, methodologies, and keywords from the Job Description.
2. Extract all existing skills from the Candidate Resume.
3. Compare both lists and identify missing skills.
4. If a missing skill is relevant to the candidate's background, projects, education, or experience, incorporate it naturally into:

   * Skills section
   * Projects section
   * Experience section
   * Summary section
5. Improve ATS compatibility by including important keywords from the Job Description.
6. Preserve all truthful information from the original resume.
7. Do NOT invent fake companies, internships, certifications, projects, achievements, or years of experience.
8. Rewrite bullet points to better match the Job Description.
9. Keep the resume concise, professional, and recruiter-friendly.
10. Return the COMPLETE optimized resume content.

Special Rules:

* If the Job Description contains technologies such as Docker, Jira, AWS, Kubernetes, Jenkins, Spring Boot, React, Node.js, MongoDB, SQL, REST APIs, Agile, Git, etc., ensure they appear in the resume when reasonably relevant.
* Add missing keywords naturally instead of simply listing them.
* Increase ATS keyword coverage while maintaining authenticity.
* Prioritize Skills, Projects, and Technical Summary sections for keyword optimization.



JSON FORMAT:

{
  "title": "Backend Developer",
  "matchScore": 85,

  "technicalQuestions": [
    {
      "question": "What is Node.js event loop?",
      "intention": "Check Node.js fundamentals",
      "answer": "Event loop handles async operations in Node.js."
    }
  ],

  "behaviouralQuestions": [
    {
      "question": "Tell me about a challenge you faced.",
      "intention": "Evaluate problem solving skills",
      "answer": "I solved API optimization issues."
    }
  ],

  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "Node.js Fundamentals",
      "tasks": [
        "Study event loop",
        "Practice async-await"
      ]
    }
  ]
}

Generate:
- 5 technical questions
- 5 behavioural questions
- 3 skill gaps
- 5 day preparation plan

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  try {

    const model = "gemini-2.5-flash";

    console.log("MODEL => ", model);

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("RAW GEMINI RESPONSE => ", cleanedText);

    let parsedData;

    try {

      parsedData = JSON.parse(cleanedText);

    } catch (parseError) {

      console.log("INVALID JSON => ", cleanedText);

      throw new Error("Gemini returned invalid JSON");
    }

    const validatedData = interviewReportSchema.parse(parsedData);

    return validatedData;

  } catch (error) {

    console.error(
      "FULL ERROR => ",
      error.response?.data || error.message || error
    );

    throw error;
  }
}

async function generateFromHtml(htmlContent) {

  const executablePath = await chromium.executablePath();

  console.log("CHROMIUM PATH => ", executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    args: chromium.args,
    headless: true,
    defaultViewport: chromium.defaultViewport,
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  })
   await browser.close();

  return pdfBuffer;
  };

 





 

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {

  const prompt = `
Generate a professional ATS-friendly resume in HTML format.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Special Rules:

If the Job Description contains technologies such as Docker, Jira, AWS, Kubernetes, Jenkins, Spring Boot, React, Node.js, MongoDB, SQL, REST APIs, Agile, Git, etc., ensure they appear in the resume when reasonably relevant.
Add missing keywords naturally instead of simply listing them.
Increase ATS keyword coverage while maintaining authenticity.
Prioritize Skills, Projects, and Technical Summary sections for keyword optimization.

JSON FORMAT:

{
  "html": "<html>complete html here</html>"
}
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response from Gemini resume generator");
    }

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("RAW RESUME RESPONSE => ", cleanedText);

    let jsonContent;

    try {

      jsonContent = JSON.parse(cleanedText);

    } catch (parseErr) {

      console.log("INVALID RESUME JSON => ", cleanedText);

      throw new Error("Gemini returned invalid resume JSON");
    }

    if (!jsonContent?.html) {
      throw new Error("Resume generator did not return HTML");
    }

    const pdfBuffer = await generateFromHtml(jsonContent.html);

    return pdfBuffer;

  } catch (error) {

    console.error(
      "RESUME PDF ERROR => ",
      error.response?.data || error.message || error
    );

    throw error;
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};

