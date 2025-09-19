import { useState } from 'react';
import CouponModal from '../components/CouponModal';

export default function AssessmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const activeTests = [
    {
      id: 1,
      name: 'Stream finder',
      color: '#ff6b6b',
      description: 'Discover your ideal academic stream'
    },
    {
      id: 2,
      name: 'Career Finder',
      color: '#4ecdc4',
      description: 'Find your perfect career path'
    },
    {
      id: 3,
      name: 'Personality Assessment',
      color: '#45b7d1',
      description: 'Understand your personality traits'
    },
    {
      id: 4,
      name: 'Skills Evaluation',
      color: '#96ceb4',
      description: 'Evaluate your current skill set'
    },
    {
      id: 5,
      name: 'Interest Profiler',
      color: '#feca57',
      description: 'Identify your core interests'
    }
  ];

  const handleAttemptTest = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  const handleCouponSubmit = (couponCode) => {
    // Handle coupon code validation and test start logic here
    console.log('Starting test:', selectedTest.name, 'with coupon:', couponCode);
    // You can add navigation to the actual test here
    handleCloseModal();
  };

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        <div className="assessment-card">
          {/* Header Content */}
          <div className="assessment-header">
            <h1 className="assessment-title">Student assessments</h1>
            <p className="assessment-description">
              Take comprehensive assessments to discover your strengths, interests, and ideal career paths. 
              Our scientifically-designed tests provide personalized insights to help guide your academic 
              and professional journey. Each assessment is carefully crafted by experts to give you 
              actionable recommendations for your future.
            </p>
          </div>

          {/* Active Tests Section */}
          <div className="active-tests-section">
            <h2 className="active-tests-title">Active Tests</h2>
            
            <div className="tests-list">
              {activeTests.map((test) => (
                <div key={test.id} className="test-item">
                  <div 
                    className="test-stripe" 
                    style={{ backgroundColor: test.color }}
                  ></div>
                  
                  <div className="test-content">
                    <h3 className="test-name">{test.name}</h3>
                    <p className="test-description">{test.description}</p>
                  </div>
                  
                  <button 
                    className="attempt-button"
                    onClick={() => handleAttemptTest(test)}
                  >
                    ATTEMPT NOW
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <CouponModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCouponSubmit}
          testName={selectedTest?.name}
        />
      )}
    </div>
  );
}
