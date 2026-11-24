
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of API call
    const users = JSON.parse(localStorage.getItem('spendwise_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      onLogin({
        id: user.id,
        name: user.name,
        email: user.email,
        budget: user.budget || 2000
      }, 'fake-jwt-token');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="text-center mb-10">
        <div className="bg-indigo-600 p-4 rounded-2xl text-white inline-block mb-4 shadow-xl shadow-indigo-100">
          <Icons.Wallet className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">SpendWise Pro</h1>
        <p className="text-slate-500 mt-2">Welcome back! Please sign in.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{' '}
          <button onClick={onToggle} className="text-indigo-600 font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
      
      <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Demo: Sign up first to create an account, or try any credentials if they match.
        </p>
      </div>
    </div>
  );
};

export default Login;
