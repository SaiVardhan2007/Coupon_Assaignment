import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    location: '',
    education: '',
    experience: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      bio: '',
      location: '',
      education: '',
      experience: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FF9900&color=fff&size=120`}
              alt="Profile"
              className="profile-avatar-large"
            />
            <div className="profile-basic-info">
              <h1 className="profile-name">{user?.name || 'User'}</h1>
              <p className="profile-email">{user?.email || 'user@example.com'}</p>
              <span className="profile-role">{user?.role || 'Student'}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{formData.name || 'Not provided'}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{formData.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="form-value">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="form-value">{formData.location || 'Not provided'}</p>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about yourself"
                    rows="4"
                  />
                ) : (
                  <p className="form-value">{formData.bio || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Education & Experience</h2>
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Education</label>
                {isEditing ? (
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Your educational background"
                    rows="3"
                  />
                ) : (
                  <p className="form-value">{formData.education || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                {isEditing ? (
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Your work experience"
                    rows="3"
                  />
                ) : (
                  <p className="form-value">{formData.experience || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button onClick={handleSave} className="btn btn-primary">
                Save Changes
              </button>
              <button onClick={handleCancel} className="btn btn-outline">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
