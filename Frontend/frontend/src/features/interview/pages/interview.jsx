import "../style/interview.scss"
import { useEffect, useState } from "react"
import { useInterview } from "../../auth/hooks/useinterview.js"
import { useParams } from "react-router-dom"
import { Brain, Users, Map, FileText } from "lucide-react"
import Loader from "../components/Loader"
import Toast from "../components/Toast"

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical")
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)
  const [toast, setToast] = useState(null)

  const { report, getReportById, loading, getResumePdf } = useInterview()

  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  // Loading state
  if (!report) {
    return <h1>data not found</h1>
  }

  const scoreColor =
    report?.matchScore > 80
      ? "green"
      : report?.matchScore > 60
      ? "orange"
      : "red"

  const jobTitle =
    report?.jobDescription
      ?.split("\n")[0]
      ?.replace("Position: ", "") || "Job Role"

  const location =
    report?.jobDescription?.match(/Location:\s*(.+)/)?.[1] ||
    "Remote"

  const handleGeneratePdf = async () => {
    setIsLoadingPdf(true)
    try {
      await getResumePdf(interviewId)
      setToast({ message: "Resume PDF generated and downloaded successfully!", type: "success" })
    } catch (error) {
      setToast({ message: error.message || "Failed to generate PDF. Please try again.", type: "error" })
    } finally {
      setIsLoadingPdf(false)
    }
  }

  return (
    <main className="interview-page">
      {isLoadingPdf && <Loader text="Please wait while we build your professional resume..." />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* LEFT SIDEBAR */}
      <aside className="interview-nav">
        <div className="nav-title">Sections</div>

        <button
          className={`nav-item ${
            activeNav === "technical" ? "active" : ""
          }`}
          onClick={() => setActiveNav("technical")}
        >
          <Brain className="nav-icon" />
          <span>Technical Questions</span>
        </button>

        <button
          className={`nav-item ${
            activeNav === "behavioral" ? "active" : ""
          }`}
          onClick={() => setActiveNav("behavioral")}
        >
          <Users className="nav-icon" />
          <span>Behavioral Questions</span>
        </button>

        <button
          className={`nav-item ${
            activeNav === "roadmap" ? "active" : ""
          }`}
          onClick={() => setActiveNav("roadmap")}
        >
          <Map className="nav-icon" />
          <span>Road Map</span>
        </button>

        <div className="nav-divider"></div>

        <button 
          onClick={handleGeneratePdf} 
          className='nav-item nav-pdf-button'
          disabled={isLoadingPdf}
        >
          <FileText className="nav-icon" />
          <span>{isLoadingPdf ? "Generating..." : "Generate Resume PDF"}</span>
        </button>
      </aside>

    
      <section className="interview-content">
        <div className="content-header">
          <div>
            <span className="eyebrow">
              {activeNav === "technical"
                ? "Technical Questions"
                : activeNav === "behavioral"
                ? "Behavioral Questions"
                : "Preparation Roadmap"}
            </span>

            <h1>Interview Preparation</h1>
          </div>

          <span className="question-count">
            {activeNav === "technical" &&
              `${report?.technicalQuestions?.length || 0} questions`}

            {activeNav === "behavioral" &&
              `${report?.behaviouralQuestions?.length || 0} questions`}

            {activeNav === "roadmap" &&
              `${report?.preparationPlan?.length || 0} days`}
          </span>
        </div>

        {/* JOB SUMMARY */}
        <div className="job-summary-card">
          <div>
            <h2>{jobTitle}</h2>
            <p>{location}</p>
          </div>

          <span className="badge outline">Current role</span>
        </div>

        {/* TECHNICAL QUESTIONS */}
        {activeNav === "technical" && (
          <div className="question-list">
            {report?.technicalQuestions?.map((question, index) => (
              <article key={index} className="question-card">
                <span className="question-number">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <div className="question-body">
                  <h3>{question.question}</h3>

                  <p>
                    <strong>Intention:</strong>{" "}
                    {question.intention}
                  </p>

                  <p>
                    <strong>Answer:</strong>{" "}
                    {question.answer}
                  </p>
                </div>

                <span className="question-expand">›</span>
              </article>
            ))}
          </div>
        )}

        {/* BEHAVIORAL QUESTIONS */}
        {activeNav === "behavioral" && (
          <div className="question-list">
            {report?.behaviouralQuestions?.map((question, index) => (
              <article key={index} className="question-card">
                <span className="question-number">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <div className="question-body">
                  <h3>{question.question}</h3>

                  <p>
                    <strong>Intention:</strong>{" "}
                    {question.intention}
                  </p>

                  <p>
                    <strong>Answer:</strong>{" "}
                    {question.answer}
                  </p>
                </div>

                <span className="question-expand">›</span>
              </article>
            ))}
          </div>
        )}

        {/* ROADMAP */}
        {activeNav === "roadmap" && (
          <div className="question-list">
            {report?.preparationPlan?.map((plan, index) => (
              <article key={index} className="question-card">
                <span className="question-number">
                  Day {plan.day}
                </span>

                <div className="question-body">
                  <h3>{plan.focus}</h3>

                  <ul>
                    {plan.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="insight-panel">
        {/* MATCH SCORE */}
        <div className="score-card">
          <span>Match Score</span>

          <div className={`score-ring ${scoreColor}`}>
            <strong>{report?.matchScore || 0}</strong>
            <small>%</small>
          </div>

          <p>
            {report?.matchScore > 80
              ? "Strong match for this role"
              : report?.matchScore > 60
              ? "Moderate match for this role"
              : "Needs improvement"}
          </p>
        </div>

        {/* SKILL GAPS */}
        <div className="gaps-card">
          <div className="panel-title">Skill Gaps</div>

          {report?.skillGaps?.map((gap, index) => (
            <div
              key={index}
              className={`gap-pill ${gap.severity}`}
            >
              {gap.skill} ({gap.severity})
            </div>
          ))}
        </div>

        {/* PREVIEW */}
        <div className="preview-card">
          <div className="preview-label">
            Mock Interview Preview
          </div>

          <div className="preview-video" />
        </div>
      </aside>
    </main>
  )
}

export default Interview