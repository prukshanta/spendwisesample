
export type Category = 'Food' | 'Transport' | 'Shopping' | 'Utilities' | 'Health' | 'Entertainment' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  budget: number;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalSpent: number;
  categoryBreakdown: { category: string; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
  budgetStatus: {
    percentage: number;
    isWarning: boolean;
    remaining: number;
  };
}
