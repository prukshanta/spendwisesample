
import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface NavbarProps {
  user: User;
  currentView: string;
  setView: (view: any) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('dashboard')}
        >
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Icons.Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 hidden sm:block">SpendWise Pro</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('dashboard')}
            className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('expenses')}
            className={`text-sm font-medium transition-colors ${currentView === 'expenses' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Expenses
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">Budget: ${user.budget.toLocaleString()}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              title="Logout"
            >
              <Icons.LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
