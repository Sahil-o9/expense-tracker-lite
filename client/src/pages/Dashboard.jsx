import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
const CATEGORIES = ['All', 'Food', 'Shopping', 'Travel', 'Bills', 'Education', 'Other'];

// Modernized Expense Card Component
const ExpenseCardBlock = React.memo(({ exp, totalAmount, onDelete }) => {
  const amount = Number(exp.amount) || 0;
  const percentage = totalAmount > 0 ? Math.min((amount / totalAmount) * 100, 100) : 0;

  return (
    <div className="group relative bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            {exp.category}
          </span>
          <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug truncate">
            {exp.title}
          </h4>
        </div>

        {/* Delete Icon Button */}
        <button
          type="button"
          onClick={() => onDelete(exp._id)}
          aria-label="Delete Expense"
          title="Delete Expense"
          className="w-8 h-8 p-0 m-0 shrink-0 inline-flex items-center justify-center bg-transparent hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer border-none outline-none shadow-none"
        >
          <svg
            className="w-4 h-4 block m-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Amount & Share Bar */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Amount
          </span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            ₹{amount.toFixed(2)}
          </span>
        </div>

        {/* Share progress bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-right text-slate-400 font-medium m-0">
            {percentage.toFixed(1)}% of total
          </p>
        </div>
      </div>
    </div>
  );
});

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dropdown & Modal States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const categoryRef = useRef(null);
  const settingsRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Add Expense Form State
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });

  const navigate = useNavigate();

  // Active User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return { name: 'User', email: 'user@example.com' };
    }
  });

  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_accounts') || '[]');
    } catch {
      return [];
    }
  });

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchExpenses = useCallback(async (activeToken) => {
    const tokenToUse = activeToken || localStorage.getItem('token');
    if (!tokenToUse) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        showToast('Failed to load expenses', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast]);

  // Auth & Account Sync Effect
  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      navigate('/login');
      return;
    }

    if (currentUser?.email) {
      setSavedAccounts((prev) => {
        const exists = prev.some((acc) => acc.email === currentUser.email);
        const updated = exists
          ? prev.map((acc) =>
              acc.email === currentUser.email
                ? { ...acc, name: currentUser.name || 'User', token: currentToken }
                : acc
            )
          : [...prev, { name: currentUser.name || 'User', email: currentUser.email, token: currentToken }];

        localStorage.setItem('saved_accounts', JSON.stringify(updated));
        return updated;
      });
    }

    fetchExpenses(currentToken);
  }, [currentUser, navigate, fetchExpenses]);

  // Handle Outside Clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Dark Mode Class Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!formData.title || !formData.amount || !token) return;

    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/expenses`,
        {
          title: formData.title,
          amount: Number(formData.amount),
          category: formData.category,
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ title: '', amount: '', category: 'Food' });
      showToast('Expense added successfully!', 'success');
      fetchExpenses(token);
    } catch (err) {
      console.error('Add expense error:', err.response?.data || err.message);
      showToast(err.response?.data?.message || 'Error adding expense', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!deleteId || !token) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Expense deleted successfully!', 'success');
      setDeleteId(null);
      fetchExpenses(token);
    } catch (err) {
      showToast('Failed to delete expense', 'error');
    }
  }, [deleteId, showToast, fetchExpenses]);

  const handleSetDeleteId = useCallback((id) => setDeleteId(id), []);

  const handleSwitchAccount = useCallback((acc) => {
    if (!acc || !acc.token) return;

    localStorage.setItem('token', acc.token);
    localStorage.setItem('user', JSON.stringify({ name: acc.name, email: acc.email }));

    setCurrentUser({ name: acc.name, email: acc.email });
    setIsSettingsOpen(false);

    showToast(`Switched to ${acc.name}`);
    fetchExpenses(acc.token);
  }, [showToast, fetchExpenses]);

  const handleAddAccount = () => {
    setIsSettingsOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return expenses.filter((e) => {
      const matchesQuery =
        e.title?.toLowerCase().includes(query) || e.category?.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Toast Notification (Highest Z-index & Top-Right) */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] transition-all">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-500 shadow-red-500/20'
                : 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
            }`}
          >
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-white/80 hover:text-white bg-transparent border-none p-0 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-80 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                ₹
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-none">
                  TrackLite
                </h1>
                <span className="text-xs text-slate-400">Expense Manager</span>
              </div>
            </div>

            {/* 3-DOTS SETTINGS DROPDOWN */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border-none outline-none transition cursor-pointer"
                aria-label="Settings Menu"
              >
                ⋮
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-2 z-50 space-y-1">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Active Account
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  </div>

                  {savedAccounts.length > 1 && (
                    <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                      <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Account
                      </p>
                      {savedAccounts.map(
                        (acc) =>
                          acc.email !== currentUser?.email && (
                            <button
                              key={acc.email}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwitchAccount(acc);
                              }}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition border-none outline-none bg-transparent"
                            >
                              <span className="truncate">{acc.name}</span>
                              <span className="text-[10px] text-indigo-500 font-bold shrink-0 ml-2">
                                Switch ➔
                              </span>
                            </button>
                          )
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddAccount}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 cursor-pointer transition border-none outline-none bg-transparent"
                  >
                    <span>➕ Add another account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDarkMode((prev) => !prev)}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition border-none outline-none bg-transparent"
                  >
                    <span>Appearance</span>
                    <span className="text-xs">{darkMode ? '🌙 Dark' : '☀️ Light'}</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between cursor-pointer transition rounded-b-xl border-none outline-none bg-transparent"
                    >
                      <span>Logout Account</span>
                      <span>🚪</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ➕ Add New Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Grocery"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 500"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm shadow-md transition active:scale-95 cursor-pointer border-none"
              >
                {submitting ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  🔍
                </span>
              </div>
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative w-full sm:w-56" ref={categoryRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Filter Category
              </label>
              <div
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <span>
                  {selectedCategory === 'All'
                    ? 'All Categories'
                    : selectedCategory}
                </span>
                <span className="text-slate-400 text-[10px]">{isCategoryOpen ? '▲' : '▼'}</span>
              </div>

              {/* Positioned cleanly below container using top-full */}
              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30 max-h-56 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className={`px-4 py-2 text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Display */}
            <div className="flex flex-col items-start sm:items-end justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Total
              </span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-tight">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

          </div>
        </div>

        {/* Expense Log Header Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base m-0">
              Expense Log ({filteredExpenses.length})
            </h3>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-xs cursor-pointer bg-transparent border-none outline-none shadow-none p-0 m-0 w-auto inline-block"
              >
                Reset Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
              Loading expenses...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
              No matching transactions found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExpenses.map((exp) => (
                <ExpenseCardBlock
                  key={exp._id}
                  exp={exp}
                  totalAmount={totalAmount}
                  onDelete={handleSetDeleteId}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Delete Expense?</h3>
            <p className="text-xs text-slate-500">Are you sure you want to delete this item?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold border-none cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}