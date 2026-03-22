import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransactionType } from '@/types/finance';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onAdd: (transaction: {
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
  }) => void;
}

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Other']
};

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      date: new Date().toISOString(),
    });

    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Type</label>
        <div className="flex p-1 bg-muted rounded-lg w-fit">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory(CATEGORIES.expense[0]);
            }}
            className={cn(
              "px-4 py-1.5 text-sm rounded-md transition-all",
              type === 'expense' ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory(CATEGORIES.income[0]);
            }}
            className={cn(
              "px-4 py-1.5 text-sm rounded-md transition-all",
              type === 'income' ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            Income
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES[type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <PlusCircle className="w-4 h-4" />
        Add Transaction
      </motion.button>
    </form>
  );
};