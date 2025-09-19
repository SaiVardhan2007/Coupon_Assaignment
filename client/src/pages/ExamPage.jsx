import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ExamPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sample assessment questions
  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Which of the following best describes your preferred learning style?',
      options: [
        'Visual - I learn best through diagrams, charts, and visual aids',
        'Auditory - I learn best through listening and discussion',
        'Kinesthetic - I learn best through hands-on activities',
        'Reading/Writing - I learn best through reading and taking notes'
      ]
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'What type of work environment motivates you the most?',
      options: [
        'Collaborative team environment with frequent interaction',
        'Independent work with minimal supervision',
        'Structured environment with clear guidelines',
        'Dynamic environment with varied challenges'
      ]
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Which subject area interests you the most?',
      options: [
        'Science, Technology, Engineering, Mathematics (STEM)',
        'Arts, Literature, and Creative Fields',
        'Business, Economics, and Management',
        'Social Sciences and Human Services'
      ]
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: 'How do you prefer to solve complex problems?',
      options: [
        'Break it down into smaller, manageable parts',
        'Brainstorm multiple creative solutions',
        'Research and analyze data thoroughly',
        'Collaborate with others to find solutions'
      ]
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'What motivates you most in your career goals?',
      options: [
        'Making a positive impact on society',
        'Achieving financial success and stability',
        'Personal growth and continuous learning',
        'Recognition and leadership opportunities'
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-mentorify-cream p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-2">Assessment Completed!</h1>
              <p className="text-green-100">Your responses have been submitted successfully</p>
            </div>
            
            <div className="p-8 text-center">
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">{getAnsweredCount()}/{questions.length}</div>
                <p className="text-gray-600">Questions Answered</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
                <p className="text-gray-600 mb-4">
                  Your assessment results are being processed. You'll receive detailed insights about your:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-mentorify-orange rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <span className="text-gray-700">Learning preferences and style</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-mentorify-blue rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <span className="text-gray-700">Career path recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <span className="text-gray-700">Skill development areas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <span className="text-gray-700">Personalized action plan</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/user-dashboard')}
                className="bg-gradient-to-r from-mentorify-orange to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-mentorify-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 border-4 border-mentorify-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Assessment</h2>
          <p className="text-gray-600">Please wait while we analyze your responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mentorify-cream via-white to-mentorify-cream p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-mentorify-blue to-blue-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Career Assessment</h1>
                <p className="text-blue-100 mt-1">Discover your ideal career path</p>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-blue-100 text-sm">Time Remaining</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="px-8 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-mentorify-orange to-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-mentorify-orange to-orange-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {questions[currentQuestion].question}
                </h2>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-mentorify-orange hover:bg-orange-50 ${
                    answers[questions[currentQuestion].id] === option
                      ? 'border-mentorify-orange bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestion].id}`}
                    value={option}
                    checked={answers[questions[currentQuestion].id] === option}
                    onChange={() => handleAnswerChange(questions[currentQuestion].id, option)}
                    className="mt-1 mr-4 h-4 w-4 text-mentorify-orange focus:ring-mentorify-orange border-gray-300"
                  />
                  <span className="text-gray-700 leading-relaxed">{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentQuestion
                        ? 'bg-mentorify-orange'
                        : answers[questions[index].id]
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Submit Assessment
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-mentorify-orange to-orange-400 hover:from-orange-500 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Answer honestly based on your genuine preferences</li>
                <li>• Take your time to consider each option carefully</li>
                <li>• There are no right or wrong answers</li>
                <li>• You can navigate back to previous questions if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
