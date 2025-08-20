import React, { useState } from 'react';
import { Mail, Lock, User, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onToggleAuth: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleAuth }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer' as 'provider' | 'buyer',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(formData.email, formData.password, formData.role);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-emerald-100 rounded-full">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'buyer' })}
              className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                formData.role === 'buyer'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Buyer</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'provider' })}
              className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                formData.role === 'provider'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Provider</div>
            </button>
          </div>
        </div>

        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          leftIcon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleAuth}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};