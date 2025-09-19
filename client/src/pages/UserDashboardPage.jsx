import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserDashboardPage() {
  const { user } = useAuth();
  // Mock user data fallback
  const profile = user || {
    name: 'John Doe',
    currentStudies: '12',
    email: 'john@example.com',
    school: 'Springfield High',
    phoneNumber: '9876543210',
    city: 'Springfield',
    state: 'Illinois',
    avatar: '',
  };

  // Assessment section data with enhanced descriptions and icons
  const tests = [
    { 
      id: 1, 
      name: 'Stream Finder', 
      description: 'Discover the perfect academic stream based on your interests and aptitude',
      color: 'from-red-500 to-pink-500',
      icon: '🎯',
      duration: '15 mins'
    },
    { 
      id: 2, 
      name: 'Career Finder', 
      description: 'Explore career paths that align with your skills and passions',
      color: 'from-green-500 to-emerald-500',
      icon: '💼',
      duration: '20 mins'
    },
    { 
      id: 3, 
      name: 'Aptitude Test', 
      description: 'Assess your cognitive abilities and problem-solving skills',
      color: 'from-purple-500 to-violet-500',
      icon: '🧠',
      duration: '25 mins'
    },
    { 
      id: 4, 
      name: 'Personality Test', 
      description: 'Understand your personality traits and behavioral patterns',
      color: 'from-blue-500 to-cyan-500',
      icon: '👤',
      duration: '18 mins'
    },
  ];

  // Coupon redemption modal state
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAttempt = (test) => {
    setSelectedTest(test);
    setShowModal(true);
    setCouponCode('');
    setModalError('');
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
    try {
      await axios.post('/api/coupons/redeem', { couponCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      navigate('/exam');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Redemption failed');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-mentorify-cream p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-mentorify-orange">{profile.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-600 text-lg">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-mentorify-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-mentorify-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Hours</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-mentorify-orange to-orange-400 px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:w-1/4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-mentorify-orange to-orange-400 p-1 shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=FF9900&color=fff&size=128`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <button className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Change</span>
                    </button>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-600">Class {profile.currentStudies}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      value={profile.name} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      value={profile.email} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">School/Institution</label>
                    <input 
                      value={profile.school || ''} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      value={profile.phoneNumber || ''} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input 
                      value={profile.city || ''} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input 
                      value={profile.state || ''} 
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isEditing 
                          ? 'border-mentorify-orange focus:ring-2 focus:ring-mentorify-orange focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      } font-medium text-gray-800`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex gap-4 mt-8">
                    <button className="bg-mentorify-orange hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Assessments Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-mentorify-blue to-blue-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Available Assessments</h2>
            <p className="text-blue-100 mt-2">Discover your strengths and explore career paths with our comprehensive tests</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <div key={test.id} className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${test.color}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{test.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-mentorify-orange transition-colors">
                            {test.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">Duration:</span>
                            <span className="text-sm font-medium text-mentorify-orange">{test.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{test.description}</p>
                    
                    <button
                      onClick={() => handleAttempt(test)}
                      className={`w-full bg-gradient-to-r ${test.color} text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
                    >
                      Start Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coupon Code Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="bg-gradient-to-r from-mentorify-orange to-orange-400 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Enter Coupon Code</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-orange-100 text-sm mt-1">for {selectedTest?.name}</p>
              </div>
              
              <div className="p-6">
                {modalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{modalError}</p>
                  </div>
                )}
                
                <form onSubmit={handleRedeem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter your coupon code"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={modalLoading}
                    className="w-full bg-mentorify-orange hover:bg-orange-500 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {modalLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      'Start Assessment'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
