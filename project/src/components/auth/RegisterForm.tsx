import React, { useState } from 'react';
import { Mail, Lock, User, Building, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onToggleAuth: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleAuth }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'provider' | 'buyer',
    organization: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.role === 'provider' && !formData.organization) {
      newErrors.organization = 'Organization is required for providers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      organization: formData.role === 'provider' ? formData.organization : undefined,
      phone: formData.phone || undefined,
    };

    const success = await register(userData, formData.password);
    if (!success) {
      setErrors({ submit: 'Registration failed. Please try again.' });
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
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join our food redistribution community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
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
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<User className="w-4 h-4" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          leftIcon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        {formData.role === 'provider' && (
          <Input
            label="Organization"
            placeholder="Enter your organization name"
            leftIcon={<Building className="w-4 h-4" />}
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            error={errors.organization}
          />
        )}

        <Input
          type="tel"
          label="Phone Number (Optional)"
          placeholder="Enter your phone number"
          leftIcon={<Phone className="w-4 h-4" />}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="w-4 h-4" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggleAuth}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};