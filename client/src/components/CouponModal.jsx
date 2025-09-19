import { useState } from 'react';

export default function CouponModal({ isOpen, onClose, onSubmit, testName }) {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically validate the coupon with your backend
      // For now, we'll accept any non-empty coupon
      onSubmit(couponCode.trim());
    } catch (err) {
      setError('Invalid coupon code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCouponCode('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Enter Coupon Code</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="test-info">
            <h3 className="test-info-title">Starting Assessment:</h3>
            <p className="test-info-name">{testName}</p>
          </div>

          <form onSubmit={handleSubmit} className="coupon-form">
            <div className="form-group">
              <label htmlFor="couponCode" className="form-label">
                Coupon Code
              </label>
              <input
                id="couponCode"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
                placeholder="Enter your coupon code"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message">
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="error-text">{error}</span>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-content">
                    <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </div>
                ) : (
                  'Start Assessment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
