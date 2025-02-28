import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Building2, Lock, User, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft overflow-hidden animate-fade-in">
        <div className="p-8">
          <div className="flex justify-center mb-8 animate-slide-in">
            <div className="flex items-center space-x-3">
              <Building2 className="h-10 w-10 text-primary-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Ello × Stacia
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-secondary-800 mb-2 animate-slide-in" style={{ animationDelay: '100ms' }}>
            Communication Platform
          </h2>
          <p className="text-center text-secondary-500 mb-8 animate-slide-in" style={{ animationDelay: '200ms' }}>
            Sign in to your account to continue
          </p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center animate-fade-in">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in" style={{ animationDelay: '300ms' }}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-2.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>
          <div className="mt-8 space-y-2 text-center animate-slide-in" style={{ animationDelay: '400ms' }}>
            <p className="text-sm font-medium text-secondary-700">Demo Credentials</p>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600">
                <span className="font-medium">Ello:</span>{' '}
                <code className="px-2 py-1 bg-white rounded text-primary-600">ello_admin / Password</code>
              </p>
              <p className="text-sm text-secondary-600 mt-2">
                <span className="font-medium">Stacia:</span>{' '}
                <code className="px-2 py-1 bg-white rounded text-primary-600">stacia_admin / Password</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;