
import React, { useState, useEffect, useCallback } from 'react';
import { User, Expense, AuthState } from './types';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

// Mock backend service simulation
const STORAGE_KEY = 'spendwise_data';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('spendwise_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [view, setView] = useState<'dashboard' | 'expenses' | 'login' | 'signup' | 'add' | 'edit'>('login');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    localStorage.setItem('spendwise_auth', JSON.stringify(authState));
    if (authState.isAuthenticated) {
      const allExpenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setExpenses(allExpenses.filter((e: Expense) => e.userId === authState.user?.id));
      setView('dashboard');
    } else {
      setView('login');
    }
  }, [authState.isAuthenticated]);

  const handleLogin = (user: User, token: string) => {
    setAuthState({ user, token, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuthState({ user: null, token: null, isAuthenticated: false });
  };

  const addExpense = (newExpense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!authState.user) return;
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
      userId: authState.user.id,
      createdAt: new Date().toISOString(),
    };
    const updated = [expense, ...expenses];
    setExpenses(updated);
    
    const allStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([expense, ...allStored]));
    setView('dashboard');
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    const updatedExpenses = expenses.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setExpenses(updatedExpenses);

    const allStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedAll = allStored.map((e: Expense) => e.id === id ? { ...e, ...updatedFields } : e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
    setView('dashboard');
    setEditingExpense(null);
  };

  const deleteExpense = (id: string) => {
    const filtered = expenses.filter(e => e.id !== id);
    setExpenses(filtered);

    const allStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStored.filter((e: Expense) => e.id !== id)));
  };

  const renderContent = () => {
    if (!authState.isAuthenticated) {
      return view === 'signup' ? (
        <Signup onSignup={() => setView('login')} onToggle={() => setView('login')} />
      ) : (
        <Login onLogin={handleLogin} onToggle={() => setView('signup')} />
      );
    }

    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            expenses={expenses} 
            user={authState.user!} 
            onAddClick={() => setView('add')}
          />
        );
      case 'expenses':
        return (
          <ExpenseList 
            expenses={expenses} 
            onDelete={deleteExpense} 
            onEdit={(e) => {
              setEditingExpense(e);
              setView('edit');
            }}
          />
        );
      case 'add':
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
            <ExpenseForm onSubmit={addExpense} onCancel={() => setView('dashboard')} />
          </div>
        );
      case 'edit':
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">Edit Expense</h2>
            <ExpenseForm 
              initialData={editingExpense || undefined} 
              onSubmit={(data) => updateExpense(editingExpense!.id, data)} 
              onCancel={() => {
                setEditingExpense(null);
                setView('expenses');
              }}
            />
          </div>
        );
      default:
        return <Dashboard expenses={expenses} user={authState.user!} onAddClick={() => setView('add')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {authState.isAuthenticated && (
        <Navbar 
          user={authState.user!} 
          currentView={view} 
          setView={setView} 
          onLogout={handleLogout} 
        />
      )}
      <main className="container mx-auto px-4 pb-20 pt-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
