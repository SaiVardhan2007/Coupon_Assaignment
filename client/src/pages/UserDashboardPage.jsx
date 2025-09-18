import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function UserDashboardPage() {
  const assessments = [
    { id: 1, name: 'Stream Finder', description: 'Find the best stream for your interests.' },
    { id: 2, name: 'Career Finder', description: 'Discover suitable career paths.' },
    { id: 3, name: 'Aptitude Test', description: 'Test your aptitude skills.' },
  ];
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map(test => (
          <div key={test.id} className="border rounded shadow p-4 bg-white flex flex-col">
            <div className="font-bold text-lg mb-2">{test.name}</div>
            <div className="mb-2 text-gray-600">{test.description}</div>
            <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleAttempt(test)}>
              Attempt Now
            </button>
          </div>
        ))}
      </div>
      {/* Coupon Code Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Enter Coupon Code for {selectedTest?.name}</h3>
            {modalError && <div className="mb-2 text-red-500">{modalError}</div>}
            <form onSubmit={handleRedeem} className="space-y-4">
              <input
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                required
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={modalLoading}>
                {modalLoading ? 'Verifying...' : 'Start Assessment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
