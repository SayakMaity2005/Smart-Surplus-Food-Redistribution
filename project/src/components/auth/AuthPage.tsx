import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Card, CardContent } from '../ui/Card';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-600 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Surplus</h1>
              <p className="text-emerald-600 font-medium">Food Redistribution Platform</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Reduce Food Waste,<br />
              <span className="text-emerald-600">Feed More People</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect surplus food providers with those who need it most. 
              Join our campus community in creating a sustainable, zero-waste environment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-emerald-600">2,450kg</div>
              <div className="text-sm text-gray-600">Food Saved</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">8,940</div>
              <div className="text-sm text-gray-600">People Fed</div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card>
            <CardContent className="p-8">
              {isLogin ? (
                <LoginForm onToggleAuth={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onToggleAuth={() => setIsLogin(true)} />
              )}
            </CardContent>
          </Card>

          {/* Mobile branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900">Smart Surplus</span>
            </div>
            <p className="text-gray-600">Food Redistribution Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};