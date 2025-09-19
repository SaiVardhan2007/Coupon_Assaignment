import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      if (user?.role === 'admin') navigate('/admin-dashboard');
      else navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-text">M</span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your journey</p>
        </div>

        {/* Login Form */}
        <div className="auth-form-container">
          {error && (
            <div className="error-message">
              <div className="error-content">
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  placeholder="Enter your email"
                />
                <div className="input-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  placeholder="Enter your password"
                />
                <div className="input-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="auth-options">
              <div className="checkbox-wrapper">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="auth-checkbox"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? (
                <div className="loading-content">
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="divider-line">
              <div className="divider-border">
                <div className="divider-border-line" />
              </div>
              <div className="divider-text-wrapper">
                <span className="divider-text">Don't have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="auth-link-section">
            <Link
              to="/signup"
              className="auth-link"
            >
              Create your account →
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3 className="demo-title">Demo Credentials:</h3>
          <div className="demo-content">
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
            <p><strong>User:</strong> Create a new account or use existing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
