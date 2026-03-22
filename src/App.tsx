import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Search, LayoutDashboard, ReceiptText, PieChart as ChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from './types/finance';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { FinanceCharts } from './components/FinanceCharts';
import { formatCurrency, cn } from './lib/utils';

const STORAGE_KEY = 'finance_transactions';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'analytics'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.income += curr.amount;
        acc.balance += curr.amount;
      } else {
        acc.expenses += curr.amount;
        acc.balance -= curr.amount;
      }
      return acc;
    }, { income: 0, expenses: 0, balance: 0 });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery]);

  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Wallet className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">WealthFlow</h1>
          </div>
          
          <nav className="hidden md:flex bg-muted p-1 rounded-lg">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
            <NavButton 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')} 
              icon={<ReceiptText size={18} />}
              label="History"
            />
            <NavButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              icon={<ChartIcon size={18} />}
              label="Analysis"
            />
          </nav>

          <div className="relative w-48 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              label="Total Balance" 
              value={totals.balance} 
              icon={<Wallet className="text-primary" />} 
              trend="current"
            />
            <StatCard 
              label="Total Income" 
              value={totals.income} 
              icon={<ArrowUpCircle className="text-green-500" />} 
              trend="up"
            />
            <StatCard 
              label="Total Expenses" 
              value={totals.expenses} 
              icon={<ArrowDownCircle className="text-red-500" />} 
              trend="down"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm onAdd={addTransaction} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Activity</CardTitle>
                        <button 
                          onClick={() => setActiveTab('transactions')} 
                          className="text-sm text-primary hover:underline"
                        >
                          View all
                        </button>
                      </CardHeader>
                      <CardContent>
                        <TransactionList 
                          transactions={filteredTransactions.slice(0, 5)} 
                          onDelete={deleteTransaction} 
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'transactions' && (
                  <motion.div
                    key="transactions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TransactionList 
                          transactions={filteredTransactions} 
                          onDelete={deleteTransaction} 
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FinanceCharts transactions={transactions} />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around items-center">
        <MobileNavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={20} />}
          label="Home"
        />
        <MobileNavButton 
          active={activeTab === 'transactions'} 
          onClick={() => setActiveTab('transactions')} 
          icon={<ReceiptText size={20} />}
          label="History"
        />
        <MobileNavButton 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')} 
          icon={<ChartIcon size={20} />}
          label="Stats"
        />
      </nav>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string; value: number; icon: React.ReactNode; trend: 'up' | 'down' | 'current' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{formatCurrency(value)}</h3>
          <p className={cn(
            "text-xs mt-1",
            trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
          )}>
            {trend === 'current' ? 'Available funds' : trend === 'up' ? '+Total income flow' : '-Total expenditure flow'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="text-[10px] uppercase font-bold">{label}</span>
    </button>
  );
}

export default App;