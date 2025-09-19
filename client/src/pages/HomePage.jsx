import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-blue-50">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="text-center">
            <h1 className="hero-title">
              Discover Your
              <span className="hero-title-highlight">Perfect Path</span>
            </h1>
            <p className="hero-subtitle">
              Unlock your potential with personalized assessments, career guidance, and expert mentorship. 
              Your journey to success starts here.
            </p>
            <div className="hero-buttons">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-large"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline btn-large"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="btn btn-primary btn-large"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Why Choose Mentorify?
            </h2>
            <p className="features-subtitle">
              Comprehensive tools and personalized guidance to help you make informed decisions about your future.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Assessments</h3>
              <p className="feature-description">
                Take scientifically-designed tests to discover your strengths, interests, and ideal career paths.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="feature-title">Expert Guidance</h3>
              <p className="feature-description">
                Get personalized recommendations and insights from experienced career counselors and mentors.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon feature-icon-green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="feature-title">Fast Results</h3>
              <p className="feature-description">
                Get instant, detailed reports and actionable insights to accelerate your decision-making process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Students Guided</div>
            </div>
            <div>
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Career Paths</div>
            </div>
            <div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Shape Your Future?
          </h2>
          <p className="cta-subtitle">
            Join thousands of students who have discovered their perfect career path with Mentorify.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="btn btn-white btn-large"
            >
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
