import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [couponTab, setCouponTab] = useState('ACTIVE');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const { token } = useAuth();

  // Enhanced form state for comprehensive coupon creation
  const [form, setForm] = useState({
    code: '',
    isTargeted: false,
    selectedUsers: [],
    maxUses: '',
    timeLimit: 'no-limit',
    timeLimitValue: '',
    timeLimitUnit: 'hours',
    selectedAssessments: [],
    description: ''
  });

  const availableAssessments = [
    { id: 'stream-finder', name: 'Stream Finder', color: '#ff6b6b' },
    { id: 'career-finder', name: 'Career Finder', color: '#4ecdc4' },
    { id: 'personality-assessment', name: 'Personality Assessment', color: '#45b7d1' },
    { id: 'skills-evaluation', name: 'Skills Evaluation', color: '#96ceb4' },
    { id: 'interest-profiler', name: 'Interest Profiler', color: '#feca57' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setCouponLoading(true);
      setCouponError('');
      try {
        const res = await axios.get('/api/coupons', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data);
      } catch (err) {
        setCouponError(err.response?.data?.message || 'Failed to fetch coupons');
      } finally {
        setCouponLoading(false);
      }
    };
    fetchCoupons();
  }, [token]);

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`/api/coupons/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons((prev) => prev.map(c => c._id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c));
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserSelection = (userId) => {
    setForm(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleAssessmentSelection = (assessmentId) => {
    setForm(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.includes(assessmentId)
        ? prev.selectedAssessments.filter(id => id !== assessmentId)
        : [...prev.selectedAssessments, assessmentId]
    }));
  };

  const selectAllAssessments = () => {
    setForm(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.length === availableAssessments.length
        ? []
        : availableAssessments.map(a => a.id)
    }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    
    try {
      if (!form.code.trim()) {
        throw new Error('Coupon code is required');
      }

      const payload = { 
        code: form.code.trim(),
        type: form.isTargeted ? 'INDIVIDUAL' : 'GROUP'
      };

      if (form.isTargeted) {
        if (form.timeLimit === 'limited' && form.timeLimitValue) {
          const multiplier = form.timeLimitUnit === 'minutes' ? 60 * 1000 : 60 * 60 * 1000;
          payload.expiresAt = new Date(Date.now() + Number(form.timeLimitValue) * multiplier);
        } else {
          payload.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        // FIX: Include assignedUsers for targeted coupons
        payload.assignedUsers = form.selectedUsers;
      } else {
        if (!form.maxUses) {
          throw new Error('Max uses is required for general coupons');
        }
        payload.maxUses = Number(form.maxUses);
      }

      const response = await axios.post('/api/coupons', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setShowModal(false);
      resetForm();
      
      const res = await axios.get('/api/coupons', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setCoupons(res.data);
      
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create coupon');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      isTargeted: false,
      selectedUsers: [],
      maxUses: '',
      timeLimit: 'no-limit',
      timeLimitValue: '',
      timeLimitUnit: 'hours',
      selectedAssessments: [],
      description: ''
    });
  };

  const openCouponDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setAssignError('');
    setShowAssignModal(false);
  };

  const closeCouponDetails = () => {
    setSelectedCoupon(null);
    setSelectedUserIds([]);
    setAssignError('');
  };

  const handleUserCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssignUsers = async () => {
    setAssignLoading(true);
    setAssignError('');
    try {
      await axios.post(`/api/coupons/${selectedCoupon._id}/assign`, { userIds: selectedUserIds }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh coupons
      const res = await axios.get('/api/coupons', { headers: { Authorization: `Bearer ${token}` } });
      setCoupons(res.data);
      setShowAssignModal(false);
      setSelectedUserIds([]);
      // Update selectedCoupon with new assignedUsers
      setSelectedCoupon(res.data.find(c => c._id === selectedCoupon._id));
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign users');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-mentorify-cream p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin <span className="text-mentorify-orange">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage users and coupons efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-mentorify-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-mentorify-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.status === 'ACTIVE').length}</p>
              </div>
              <div className="text-3xl">🎫</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.reduce((sum, c) => sum + (c.uses || 0), 0)}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.status === 'INACTIVE').length}</p>
              </div>
              <div className="text-3xl">⏸️</div>
            </div>
          </div>
        </div>

        {/* User Management Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-mentorify-orange to-orange-400 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-orange-100 mt-1">View and manage all registered users</p>
              </div>
              <div className="text-white text-3xl">👥</div>
            </div>
          </div>
          
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-mentorify-orange border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Loading users...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">User Info</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Education</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mentorify-orange to-orange-400 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.phoneNumber || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Class {user.currentStudies || '-'}</div>
                            <div className="text-sm text-gray-500">{user.school || 'School not specified'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.city || '-'}, {user.state || '-'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Coupon Management Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-mentorify-blue to-blue-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
                <p className="text-blue-100 mt-1">Create and manage coupon codes for assessments</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Create Coupon</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Coupon Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                  couponTab === 'ACTIVE' 
                    ? 'bg-mentorify-orange text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCouponTab('ACTIVE')}
              >
                Active Coupons ({coupons.filter(c => c.status === 'ACTIVE').length})
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                  couponTab === 'INACTIVE' 
                    ? 'bg-mentorify-orange text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCouponTab('INACTIVE')}
              >
                Inactive Coupons ({coupons.filter(c => c.status === 'INACTIVE').length})
              </button>
            </div>

            {/* Coupon List */}
            {couponLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-mentorify-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Loading coupons...</span>
                </div>
              </div>
            ) : couponError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <p className="text-red-600 font-medium">{couponError}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.filter(c => c.status === couponTab).map(coupon => (
                  <div key={coupon._id} className="group bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className={`h-2 ${coupon.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{coupon.code}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            coupon.type === 'INDIVIDUAL' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {coupon.type}
                          </span>
                        </div>
                        <div className="text-2xl">
                          {coupon.type === 'INDIVIDUAL' ? '👤' : '👥'}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Uses:</span>
                          <span className="font-semibold text-gray-900">{coupon.uses || 0}</span>
                        </div>
                        {coupon.type === 'GROUP' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Max Uses:</span>
                            <span className="font-semibold text-gray-900">{coupon.maxUses || '-'}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-semibold ${coupon.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                            {coupon.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(coupon._id)}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            coupon.status === 'ACTIVE' 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {coupon.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openCouponDetails(coupon)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Coupon Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="bg-gradient-to-r from-mentorify-blue to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create New Coupon</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{formError}</p>
                  </div>
                )}
                
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                    <input 
                      name="code" 
                      value={form.code} 
                      onChange={handleFormChange} 
                      placeholder="Enter coupon code" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-blue focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isTargeted"
                        checked={form.isTargeted}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-mentorify-blue focus:ring-mentorify-blue border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Target specific users</span>
                    </label>
                  </div>
                  
                  {form.isTargeted && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit</label>
                      <select 
                        name="timeLimit" 
                        value={form.timeLimit} 
                        onChange={handleFormChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-blue focus:border-transparent transition-all duration-200"
                      >
                        <option value="no-limit">No Time Limit (24 hours default)</option>
                        <option value="limited">Set Time Limit</option>
                      </select>
                      
                      {form.timeLimit === 'limited' && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <input 
                            name="timeLimitValue" 
                            value={form.timeLimitValue} 
                            onChange={handleFormChange} 
                            placeholder="Duration" 
                            type="number" 
                            min="1" 
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-blue focus:border-transparent"
                          />
                          <select 
                            name="timeLimitUnit" 
                            value={form.timeLimitUnit} 
                            onChange={handleFormChange} 
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-blue focus:border-transparent"
                          >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!form.isTargeted && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Uses</label>
                      <input 
                        name="maxUses" 
                        value={form.maxUses} 
                        onChange={handleFormChange} 
                        placeholder="e.g., 100" 
                        type="number" 
                        min="1" 
                        required={!form.isTargeted}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentorify-blue focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={formLoading}
                    className="w-full bg-mentorify-blue hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {formLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Coupon'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Details Modal */}
        {selectedCoupon && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
              <div className="bg-gradient-to-r from-mentorify-orange to-orange-400 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Coupon Details</h3>
                  <button 
                    onClick={closeCouponDetails}
                    className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Code</div>
                    <div className="font-bold text-lg">{selectedCoupon.code}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Type</div>
                    <div className="font-bold text-lg">{selectedCoupon.type}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className={`font-bold text-lg ${selectedCoupon.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedCoupon.status}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Uses</div>
                    <div className="font-bold text-lg">{selectedCoupon.uses || 0}</div>
                  </div>
                  {selectedCoupon.type === 'GROUP' && (
                    <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                      <div className="text-sm text-gray-600 mb-1">Max Uses</div>
                      <div className="font-bold text-lg">{selectedCoupon.maxUses || '-'}</div>
                    </div>
                  )}
                </div>

                {selectedCoupon.type === 'INDIVIDUAL' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Assigned Users</h4>
                      <button 
                        onClick={() => setShowAssignModal(true)}
                        className="bg-mentorify-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      >
                        Assign Users
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {selectedCoupon.assignedUsers && selectedCoupon.assignedUsers.length > 0 ? (
                        selectedCoupon.assignedUsers.map(au => {
                          const user = users.find(u => u._id === (au.userId?._id || au.userId));
                          return (
                            <div key={au.userId} className="flex justify-between items-center p-3 border-b last:border-b-0">
                              <span className="font-medium">{user ? user.name : au.userId}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                au.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                au.status === 'REDEEMED' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {au.status}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-gray-500">No users assigned yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {selectedCoupon.type === 'GROUP' && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Redeemed By</h4>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {selectedCoupon.redeemedBy && selectedCoupon.redeemedBy.length > 0 ? (
                        selectedCoupon.redeemedBy.map(uid => {
                          const user = users.find(u => u._id === (uid._id || uid));
                          return (
                            <div key={uid} className="flex items-center p-3 border-b last:border-b-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mentorify-orange to-orange-400 flex items-center justify-center text-white font-bold text-sm mr-3">
                                {user ? user.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <span className="font-medium">{user ? user.name : uid}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-gray-500">No redemptions yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assign Users Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="bg-gradient-to-r from-mentorify-blue to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Assign Users</h3>
                  <button 
                    onClick={() => setShowAssignModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-1">Select users to assign this coupon</p>
              </div>
              
              <div className="p-6">
                {assignError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{assignError}</p>
                  </div>
                )}
                
                <div className="max-h-64 overflow-y-auto mb-6 border border-gray-200 rounded-lg">
                  {users.map(user => (
                    <label key={user._id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleUserCheckbox(user._id)}
                        className="mr-3 h-4 w-4 text-mentorify-blue focus:ring-mentorify-blue border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mentorify-orange to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={handleAssignUsers}
                  disabled={assignLoading || selectedUserIds.length === 0}
                  className="w-full bg-mentorify-blue hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {assignLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Assigning...</span>
                    </div>
                  ) : (
                    `Assign to ${selectedUserIds.length} User${selectedUserIds.length !== 1 ? 's' : ''}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
