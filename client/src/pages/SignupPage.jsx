import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    currentStudies: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.password)) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-mentorify-orange rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-4xl font-bold text-mentorify-blue mb-2">Join Mentorify</h2>
          <p className="text-gray-600 text-lg">Start your journey to success</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-mentorify-orange text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-mentorify-orange' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-mentorify-orange text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h3>
                  <p className="text-gray-600">Let's start with your basic details</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Create a strong password"
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-mentorify-orange to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mentorify-orange transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h3>
                  <p className="text-gray-600">Help us personalize your experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentStudies" className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Class
                    </label>
                    <select
                      id="currentStudies"
                      name="currentStudies"
                      value={form.currentStudies}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select class</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your city"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mentorify-orange focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your state"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-mentorify-orange to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mentorify-orange transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-mentorify-orange hover:text-orange-600 transition-colors text-lg"
            >
              Sign in instead →
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center text-sm text-gray-600">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-mentorify-orange hover:text-orange-600 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-mentorify-orange hover:text-orange-600 font-medium">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
