import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/landing.scss";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <section className="landing-container">
        {/* Left Content Section */}
        <div className="landing-content">
          <div className="content-wrapper">
            <div className="badge">
              <span className="badge-icon">✨</span>
              Powered by Advanced AI
            </div>

            <h1 className="main-heading">
              Welcome to <span className="gradient-text">AI Resume Analyzer</span>
            </h1>

            <p className="subtitle">
              Analyze resumes, prepare for interviews, generate reports, and build professional resumes using cutting-edge AI technology.
            </p>

            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <div>
                  <h3>Smart Analysis</h3>
                  <p>AI-powered resume analysis matching job descriptions</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <div>
                  <h3>Interview Prep</h3>
                  <p>Personalized preparation roadmaps and mock questions</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">📄</span>
                <div>
                  <h3>Resume Builder</h3>
                  <p>Generate professional resumes with AI optimization</p>
                </div>
              </div>
            </div>

            <div className="cta-buttons">
              <button className="button primary-button" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="button secondary-button" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>

            <p className="trust-text">
              Join thousands of professionals preparing for their dream jobs.
            </p>
          </div>
        </div>

        {/* Right Illustration Section */}
        <div className="landing-illustration">
          <div className="illustration-container">
            <svg viewBox="0 0 400 500" className="hero-illustration">
              {/* Background cards */}
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ff4fa3', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#9850ff', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffaa00', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Floating cards - Resume */}
              <g className="card card-1">
                <rect x="30" y="40" width="140" height="180" rx="16" fill="url(#grad1)" opacity="0.9" />
                <rect x="40" y="50" width="120" height="160" rx="12" fill="#090a10" opacity="0.95" />
                <text x="50" y="75" fontSize="12" fill="#ff4fa3" fontWeight="bold">Resume</text>
                <line x1="50" y1="85" x2="150" y2="85" stroke="#ff4fa3" strokeWidth="1" opacity="0.5" />
                <rect x="50" y="100" width="100" height="8" rx="4" fill="#ff4fa3" opacity="0.3" />
                <rect x="50" y="115" width="100" height="8" rx="4" fill="#ff4fa3" opacity="0.3" />
                <rect x="50" y="130" width="80" height="8" rx="4" fill="#ff4fa3" opacity="0.3" />
              </g>

              {/* Floating cards - Analysis */}
              <g className="card card-2">
                <rect x="230" y="80" width="140" height="180" rx="16" fill="url(#grad2)" opacity="0.9" />
                <rect x="240" y="90" width="120" height="160" rx="12" fill="#090a10" opacity="0.95" />
                <text x="250" y="115" fontSize="12" fill="#00d4ff" fontWeight="bold">Analysis</text>
                <line x1="250" y1="125" x2="350" y2="125" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                <circle cx="270" cy="155" r="8" fill="#00d4ff" opacity="0.4" />
                <circle cx="310" cy="145" r="6" fill="#00d4ff" opacity="0.3" />
                <circle cx="340" cy="160" r="7" fill="#00d4ff" opacity="0.35" />
              </g>

              {/* Floating cards - Interview */}
              <g className="card card-3">
                <rect x="100" y="280" width="140" height="180" rx="16" fill="url(#grad3)" opacity="0.9" />
                <rect x="110" y="290" width="120" height="160" rx="12" fill="#090a10" opacity="0.95" />
                <text x="120" y="315" fontSize="12" fill="#ffaa00" fontWeight="bold">Interview</text>
                <line x1="120" y1="325" x2="220" y2="325" stroke="#ffaa00" strokeWidth="1" opacity="0.5" />
                <rect x="120" y="340" width="30" height="30" rx="6" fill="#ffaa00" opacity="0.3" />
                <rect x="160" y="340" width="30" height="30" rx="6" fill="#ffaa00" opacity="0.3" />
                <rect x="200" y="340" width="20" height="30" rx="6" fill="#ffaa00" opacity="0.2" />
              </g>

              {/* Center AI icon */}
              <g className="ai-icon">
                <circle cx="200" cy="350" r="45" fill="none" stroke="#ff4fa3" strokeWidth="2" opacity="0.3" />
                <circle cx="200" cy="350" r="35" fill="rgba(255, 79, 163, 0.1)" />
                <text x="190" y="360" fontSize="24" fill="#ff4fa3" fontWeight="bold">AI</text>
              </g>

              {/* Decorative dots */}
              <circle cx="60" cy="400" r="3" fill="#00d4ff" opacity="0.5" />
              <circle cx="320" cy="420" r="3" fill="#ffaa00" opacity="0.5" />
              <circle cx="150" cy="450" r="2" fill="#ff4fa3" opacity="0.5" />
              <circle cx="280" cy="460" r="2" fill="#00d4ff" opacity="0.5" />
            </svg>

            {/* Floating particles effect */}
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
