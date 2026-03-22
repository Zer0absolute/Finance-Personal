import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/finance';

interface FinanceChartsProps {
  transactions: Transaction[];
}

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];

  if (expenseData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No expense data to display</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="h-[300px]">
        <h4 className="text-sm font-medium mb-4 text-center">Expenses by Category</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {expenseData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[300px]">
        <h4 className="text-sm font-medium mb-4 text-center">Recent Spending</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transactions.slice(0, 7).reverse()}>
            <XAxis dataKey="description" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};