import { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../../auth/hooks/useinterview.js'; 
import { useNavigate } from "react-router-dom"

const Home = () => {
  const { generateReport } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const resumeRef = useRef()

  const navigate = useNavigate()

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
      setError("")
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleUploadBoxClick = () => {
    resumeRef.current?.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleGenerateReport = async () => {
    try {
      setError("")
      
      // Validation
      if (!jobDescription.trim()) {
        setError("Please enter a job description")
        return
      }

      if (!resumeFile && !selfDescription.trim()) {
        setError("Please upload a resume or provide a self description")
        return
      }

      setLoading(true)
      
      const data = await generateReport({
        jobDescription,
        resumeFile: resumeFile,
        selfDescription
      })

      if (data && data.interviewReport && data.interviewReport._id) {
        navigate(`/interview/${data.interviewReport._id}`)
      } else {
        setError("Failed to generate report. Please try again.")
      }
    } catch (err) {
      console.error("Error generating report:", err)
      setError(err.response?.data?.message || "Failed to generate interview strategy. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='home'>
      <section className='hero'>
        <h1>Create Your Custom Interview Plan</h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </section>

      {error && (
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem',
          backgroundColor: 'rgba(233, 78, 161, 0.15)',
          color: '#ff8ac6',
          borderRadius: '12px',
          border: '1px solid rgba(255, 110, 182, 0.3)',
          fontSize: '0.95rem'
        }}>
          {error}
        </div>
      )}

      <section className='panel-grid'>
        <article className='card target-card'>
          <div className='card-header'>
            <div>
              <h2>Target Job Description</h2>
              <span className='subtext'>Paste the full job description here for best results.</span>
            </div>
            <span className='badge required'>Required</span>
          </div>

          <textarea
            name='jobDescription'
            id='jobDescription'
            value={jobDescription}
            maxLength={5000}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the full job description here...'
          />
          <div className='char-count'>{jobDescription.length} / 5000 chars</div>
        </article>

        <article className='card profile-card'>
          <div className='card-header'>
            <div>
              <h2>Your Profile</h2>
              <span className='subtext'>Upload Resume or add a self description.</span>
            </div>
            <span className='badge secondary'>Best Results</span>
          </div>

          <div 
            className='upload-box'
            onClick={handleUploadBoxClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className='upload-icon'>
              <span>+</span>
            </div>
            <div>
              <strong>
                {resumeFile ? `${resumeFile.name}` : "Click to upload or drag & drop"}
              </strong>
              <small>{resumeFile ? "File selected" : "PDF or DOCX (Max 5MB)"}</small>
            </div>
          </div>

          <input 
            ref={resumeRef}
            type='file' 
            hidden 
            accept='.pdf'
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />

          <div className='input-group'>
            <label htmlFor='selfDescription'>Quick Self-Description</label>
            <textarea
              onChange={(e) => { setSelfDescription(e.target.value) }}
              name='selfDescription'
              id='selfDescription'
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy."
            />
          </div>

          <p className='note'>Either a PDF Resume or a Self Description is required to generate a personalized plan.</p>
        </article>
      </section>

      <button 
        className='generate-btn' 
        onClick={handleGenerateReport}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? "Generating..." : "Generate My Interview Strategy"}
      </button>
    </main>
  )
}

export default Home