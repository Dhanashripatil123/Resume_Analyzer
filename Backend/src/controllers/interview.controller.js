const pdfParse = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interview.model")
const { jobDescription } = require("../services/temp")

async function generateIntrviewReportController(req, res) {
  try {
    console.log("BODY => ", req.body)
    console.log("FILE => ", req.file)

    const { selfDescription, jobDescription } = req.body
    let resumeContent = ""

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer)
      resumeContent = pdfData.text || ""
    }

    if (!req.file && !selfDescription) {
      return res.status(400).json({
        message: "Either resume or self description is required",
      })
    }

    console.log("Calling AI Service...")

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    })

    console.log("AI RESPONSE => ", interviewReportByAi)

    const interviewReportData = {
      user: req.user?.id || null,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    }

    const interviewReport = new interviewReportModel(interviewReportData)
    await interviewReport.validate()
    await interviewReport.save()

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    })
  } catch (err) {
    console.log("FULL ERROR => ", err)

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Interview report validation failed",
        errors: err.errors,
      })
    }

    res.status(500).json({
      message: "Error generating interview report",
      error: err.message,
    })
  }
}

async function getInterviewReportByIdController(req, res) {

  try {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel
      .findOne({ _id: interviewId })
      .sort({ createdAt: -1 })

    if (!interviewReport) {

      return res.status(404).json({

        message: "Interview report not found"
      })
    }

    res.status(200).json({

      message: "Interview report fetched successfully",

      interviewReport
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({

      message: "Error fetching interview report",

      error: err.message
    })
  }
}

async function getAllInterviewReportController(req, res) {

  try {

    const interviewReports = await interviewReportModel
      .find({})
      .sort({ createdAt: -1 })

    res.status(200).json({

      message: "All interview reports fetched successfully",

      reports: interviewReports
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({

      message: "Error fetching interview reports",

      error: err.message
    })
  }
}

/**
 * @Description This controller handles the generation of interview reports based on user input, including resume content, self-description, and job description. It validates the input, interacts with the AI service to generate the report, and saves it to the database. Additionally, it provides endpoints to fetch individual reports by ID and to retrieve all reports.
    
*/

async function generateResumeController(req,res){
  const {interviewId} = req.params

  if(!interviewId){
    return res.status(400).json({
      message:"Interview ID is required"
    })
  }

  const interviewReport = await interviewReportModel.findById(interviewId)

  if(!interviewReport){
    return res.status(404).json({
      message:"Interview report not found"
    })
  }

  const {resume,selfDescription,jobDescription} = interviewReport

  const pdfBuffer = await generateResumePdf({resume,selfDescription,jobDescription})

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=resume_${interviewId}.pdf',
  })

  res.send(pdfBuffer)
} {

}

module.exports = {
   generateResumeController,
  generateIntrviewReportController,

  getInterviewReportByIdController,

  getAllInterviewReportController
}