import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <div className="p-6 text-xl font-bold text-blue-600">HR Manager</div>
        <nav className="mt-6">
          <Link to="/" className="flex items-center px-6 py-3 hover:bg-gray-100">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link to="/employees" className="flex items-center px-6 py-3 hover:bg-gray-100">
            <Users size={20} className="mr-3" /> Employees
          </Link>
          <button onClick={logout} className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-gray-100">
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
};
export default Layout;