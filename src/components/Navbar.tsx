import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Building2, LogOut, LayoutDashboard, FolderKanban, Clock, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  const isActivePath = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`${
        isActivePath(to)
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {currentUser.company === 'ello' ? 'Ello.one' : 'Stacia Corp'}
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </NavLink>
              <NavLink to="/projects">
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </NavLink>
              <NavLink to="/queue">
                <Clock className="h-4 w-4 mr-2" />
                Queue
              </NavLink>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              <span className="text-sm font-medium text-secondary-700 mr-4">
                {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-primary inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'} animate-fade-in`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`${
                isActivePath('/dashboard')
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <LayoutDashboard className="h-4 w-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              to="/projects"
              className={`${
                isActivePath('/projects')
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <FolderKanban className="h-4 w-4 inline mr-2" />
              Projects
            </Link>
            <Link
              to="/queue"
              className={`${
                isActivePath('/queue')
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Queue
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-secondary-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-secondary-800">{currentUser.name}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50"
              >
                <LogOut className="h-4 w-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;