import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode='popLayout'>
        {transactions.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div>
                <p className="font-medium text-foreground">{t.description}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{t.category}</span>
                  <span>•</span>
                  <span>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};