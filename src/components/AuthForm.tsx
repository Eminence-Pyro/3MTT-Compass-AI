// This component is no longer needed as we have separate Login and Register pages
// Keeping for backward compatibility but it won't be used
import React from 'react';

interface AuthFormProps {
  onLogin: (email: string, password: string, name: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Redirecting...</h2>
        <p className="text-gray-600">Please use the login or register pages.</p>
      </div>
    </div>
  );
};

export default AuthForm;