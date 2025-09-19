import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
