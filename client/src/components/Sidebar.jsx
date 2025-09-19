import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user } = useAuth();
  
  // Different menus for admin vs user
  const adminMenu = [
    { label: 'DASHBOARD', icon: 'fa-tachometer-alt', to: '/admin-dashboard' },
  ];

  const userMenu = [
    { label: 'PROFILE', icon: 'fa-user', to: '/profile' },
    { label: 'ASSESSMENT', icon: 'fa-clipboard-list', to: '/assessment' },
  ];

  const menu = user?.role === 'admin' ? adminMenu : userMenu;
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menu.map(item => (
            <li key={item.label}>
              <Link to={item.to} className="sidebar-item">
                <i className={`fas ${item.icon} sidebar-icon`}></i>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
