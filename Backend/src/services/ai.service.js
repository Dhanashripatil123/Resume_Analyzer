
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
You are a professional AI interview preparation assistant.

Generate a COMPLETE interview report in STRICT VALID JSON format.

IMPORTANT RULES:
1. Return ONLY pure JSON
2. Do NOT use markdown
3. Do NOT add explanations
4. Do NOT add extra text
5. Do NOT wrap JSON inside backticks
6. Ensure JSON is always valid
7. Every field is required
8. Keep responses concise and professional
9. matchScore must be between 0 and 100
10. severity must be only: low, medium, or high

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

IMPORTANT RULES:
1. Return ONLY valid JSON
2. Do NOT use markdown
3. Do NOT add explanations
4. Return JSON with ONLY one field called "html"

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

