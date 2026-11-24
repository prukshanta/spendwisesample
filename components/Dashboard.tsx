
import React, { useMemo } from 'react';
import { Expense, User, Category } from '../types';
import { Icons, CATEGORIES, CATEGORY_COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  user: User;
  onAddClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, user, onAddClick }) => {
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const categoryData = CATEGORIES.map(cat => ({
      name: cat,
      value: monthlyExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    })).filter(d => d.value > 0);

    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const amount = expenses
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0);
      return { month: monthLabel, amount };
    });

    const budgetPercent = (totalSpent / user.budget) * 100;

    return {
      totalSpent,
      categoryData,
      monthlyTrend,
      budgetPercent,
      isWarning: budgetPercent >= 80,
      isExceeded: budgetPercent >= 100
    };
  }, [expenses, user.budget]);

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = expenses.map(e => [e.date, e.category, e.amount, e.note]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user.name}</h1>
          <p className="text-slate-500">Here's your spending summary for this month.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={exportToCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Icons.Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={onAddClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Icons.Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {stats.isWarning && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${stats.isExceeded ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <Icons.AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-bold">{stats.isExceeded ? 'Over Budget!' : 'Budget Warning!'}</span> You've spent {stats.budgetPercent.toFixed(1)}% of your monthly budget.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold text-slate-900">${stats.totalSpent.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">Current billing cycle</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Monthly Budget</p>
          <h3 className="text-3xl font-bold text-slate-900">${user.budget.toLocaleString()}</h3>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${stats.isExceeded ? 'bg-red-500' : stats.isWarning ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${Math.min(stats.budgetPercent, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Remaining</p>
          <h3 className={`text-3xl font-bold ${stats.isExceeded ? 'text-red-600' : 'text-emerald-600'}`}>
            ${Math.max(0, user.budget - stats.totalSpent).toLocaleString()}
          </h3>
          <p className="text-xs text-slate-400 mt-2">{stats.isExceeded ? 'You are over budget!' : 'Left to spend'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#CBD5E1'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyTrend}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
