import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSignout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="logo-container" onClick={closeMenus}>
            <div className="logo-icon">
              <div className="logo-badge">
                M
              </div>
              <div className="logo-pulse"></div>
            </div>
            <span className="logo-text">
              Mentorify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-desktop">

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="profile-button"
                >
                  <div className="profile-info">
                    <span className="profile-name">{user.name || 'User'}</span>
                    <div className="profile-avatar">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=FF9900&color=fff&size=40`}
                        alt="Profile"
                        className="avatar-image"
                      />
                      <div className="avatar-status"></div>
                    </div>
                  </div>
                  <svg 
                    className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotated' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-profile">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=FF9900&color=fff&size=48`}
                          alt="Profile"
                          className="dropdown-avatar"
                        />
                        <div className="dropdown-user-info">
                          <h4>{user.name || 'User'}</h4>
                          <p>{user.email || 'user@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-menu">
                      <Link
                        to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                        className="dropdown-item"
                        onClick={closeMenus}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignout}
                        className="dropdown-item danger"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={closeMenus}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                  onClick={closeMenus}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {user ? (
                <div>
                  <div className="mobile-profile">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=FF9900&color=fff&size=32`}
                      alt="Profile"
                      className="mobile-avatar"
                    />
                    <div className="mobile-user-info">
                      <h4>{user.name || 'User'}</h4>
                      <p>{user.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <Link
                    to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                    className="mobile-menu-item"
                    onClick={closeMenus}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="mobile-menu-item danger"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="mobile-menu-item"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary mobile-menu-item"
                    onClick={closeMenus}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
