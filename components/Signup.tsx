
import React, { useState } from 'react';
import { Icons } from '../constants';

interface SignupProps {
  onSignup: () => void;
  onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState(2000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('spendwise_users') || '[]');
    if (users.some((u: any) => u.email === email)) {
      alert('Email already exists');
      return;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      budget
    };

    localStorage.setItem('spendwise_users', JSON.stringify([...users, newUser]));
    alert('Account created! Please login.');
    onSignup();
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-10">
        <div className="bg-indigo-600 p-4 rounded-2xl text-white inline-block mb-4 shadow-xl shadow-indigo-100">
          <Icons.Wallet className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="text-slate-500 mt-2">Start managing your money better today.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Budget ($)</label>
            <input
              type="number"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="2000"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <button onClick={onToggle} className="text-indigo-600 font-bold hover:underline">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
