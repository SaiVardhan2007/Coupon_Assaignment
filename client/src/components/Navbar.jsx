import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link to="/" className="font-bold text-lg">Coupon App</Link>
      <div>
        {!user ? (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link
              to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
              className="mr-4"
            >
              Dashboard
            </Link>
            <button onClick={handleSignout} className="bg-red-500 px-3 py-1 rounded">Signout</button>
          </>
        )}
      </div>
    </nav>
  );
}
