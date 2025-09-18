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
  const [form, setForm] = useState({ code: '', type: 'INDIVIDUAL', expires: '', maxUses: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const { token } = useAuth();

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const payload = { code: form.code, type: form.type };
      if (form.type === 'INDIVIDUAL') {
        if (!form.expires) throw new Error('Expiration required');
        const expiresAt = new Date(Date.now() + Number(form.expires) * 60 * 60 * 1000);
        payload.expiresAt = expiresAt;
      } else if (form.type === 'GROUP') {
        if (!form.maxUses) throw new Error('Max Uses required');
        payload.maxUses = Number(form.maxUses);
      }
      await axios.post('/api/coupons', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setForm({ code: '', type: 'INDIVIDUAL', expires: '', maxUses: '' });
      // Refresh coupons
      const res = await axios.get('/api/coupons', { headers: { Authorization: `Bearer ${token}` } });
      setCoupons(res.data);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create coupon');
    } finally {
      setFormLoading(false);
    }
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone Number</th>
                <th className="px-4 py-2 border">Current Studies</th>
                <th className="px-4 py-2 border">City</th>
                <th className="px-4 py-2 border">State</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.phoneNumber || '-'}</td>
                  <td className="px-4 py-2 border">{user.currentStudies || '-'}</td>
                  <td className="px-4 py-2 border">{user.city || '-'}</td>
                  <td className="px-4 py-2 border">{user.state || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Management Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Coupon Management</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>Create New Coupon</button>
        </div>
        {/* Modal for creating coupon */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4">Create New Coupon</h3>
              {formError && <div className="mb-2 text-red-500">{formError}</div>}
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <input name="code" value={form.code} onChange={handleFormChange} placeholder="Coupon Code" required className="w-full p-2 border rounded" />
                <select name="type" value={form.type} onChange={handleFormChange} className="w-full p-2 border rounded">
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="GROUP">GROUP</option>
                </select>
                {form.type === 'INDIVIDUAL' && (
                  <input name="expires" value={form.expires} onChange={handleFormChange} placeholder="Expiration (in hours)" type="number" min="1" className="w-full p-2 border rounded" required />
                )}
                {form.type === 'GROUP' && (
                  <input name="maxUses" value={form.maxUses} onChange={handleFormChange} placeholder="Max Uses" type="number" min="1" className="w-full p-2 border rounded" required />
                )}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={formLoading}>{formLoading ? 'Creating...' : 'Create Coupon'}</button>
              </form>
            </div>
          </div>
        )}
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 rounded-l ${couponTab === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setCouponTab('ACTIVE')}
          >
            Active Coupons
          </button>
          <button
            className={`px-4 py-2 rounded-r ${couponTab === 'INACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setCouponTab('INACTIVE')}
          >
            Inactive Coupons
          </button>
        </div>
        {couponLoading ? (
          <div>Loading coupons...</div>
        ) : couponError ? (
          <div className="text-red-500">{couponError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.filter(c => c.status === couponTab).map(coupon => (
              <div key={coupon._id} className="border rounded shadow p-4 bg-white flex flex-col cursor-pointer" onClick={() => openCouponDetails(coupon)}>
                <div className="font-bold text-lg mb-2">{coupon.code}</div>
                <div className="mb-1">Type: <span className="font-semibold">{coupon.type}</span></div>
                <div className="mb-1">Uses: <span className="font-semibold">{coupon.uses || 0}</span></div>
                {coupon.type === 'GROUP' && (
                  <div className="mb-1">Max Uses: <span className="font-semibold">{coupon.maxUses || '-'}</span></div>
                )}
                <button
                  className={`mt-2 px-3 py-1 rounded ${coupon.status === 'ACTIVE' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}
                  onClick={e => { e.stopPropagation(); handleToggleStatus(coupon._id); }}
                >
                  {coupon.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Details Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={closeCouponDetails}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Coupon Details</h3>
            <div className="mb-2"><b>Code:</b> {selectedCoupon.code}</div>
            <div className="mb-2"><b>Type:</b> {selectedCoupon.type}</div>
            <div className="mb-2"><b>Status:</b> {selectedCoupon.status}</div>
            <div className="mb-2"><b>Uses:</b> {selectedCoupon.uses || 0}</div>
            {selectedCoupon.type === 'GROUP' && (
              <div className="mb-2"><b>Max Uses:</b> {selectedCoupon.maxUses || '-'}</div>
            )}
            {selectedCoupon.type === 'INDIVIDUAL' && (
              <>
                <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowAssignModal(true)}>Assign to Users</button>
                <div className="mb-2 font-semibold">Assigned Users:</div>
                <ul className="mb-4 max-h-32 overflow-y-auto">
                  {selectedCoupon.assignedUsers && selectedCoupon.assignedUsers.length > 0 ? (
                    selectedCoupon.assignedUsers.map(au => {
                      const user = users.find(u => u._id === (au.userId?._id || au.userId));
                      return (
                        <li key={au.userId} className="flex justify-between items-center border-b py-1">
                          <span>{user ? user.name : au.userId}</span>
                          <span className="text-xs px-2 py-1 rounded bg-gray-200 ml-2">{au.status}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-500">No users assigned.</li>
                  )}
                </ul>
              </>
            )}
            {selectedCoupon.type === 'GROUP' && (
              <>
                <div className="mb-2 font-semibold">Redeemed By:</div>
                <ul className="mb-4 max-h-32 overflow-y-auto">
                  {selectedCoupon.redeemedBy && selectedCoupon.redeemedBy.length > 0 ? (
                    selectedCoupon.redeemedBy.map(uid => {
                      const user = users.find(u => u._id === (uid._id || uid));
                      return (
                        <li key={uid} className="flex justify-between items-center border-b py-1">
                          <span>{user ? user.name : uid}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-500">No users have redeemed this coupon.</li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
      {/* Assign Users Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowAssignModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Assign Coupon to Users</h3>
            {assignError && <div className="mb-2 text-red-500">{assignError}</div>}
            <div className="max-h-64 overflow-y-auto mb-4">
              {users.map(user => (
                <label key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => handleUserCheckbox(user._id)}
                    className="mr-2"
                  />
                  {user.name} <span className="ml-2 text-xs text-gray-500">({user.email})</span>
                </label>
              ))}
            </div>
            <button
              className="w-full bg-blue-600 text-white p-2 rounded"
              onClick={handleAssignUsers}
              disabled={assignLoading || selectedUserIds.length === 0}
            >
              {assignLoading ? 'Assigning...' : 'Assign Selected Users'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
