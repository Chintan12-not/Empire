'use client';

import React, { useState, useEffect } from 'react';
import SalesPerformanceSection from '@/components/admin/SalesPerformanceSection';
import { supabase } from '@/lib/supabaseClient';
import {
  Crown,
  Lock,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  Tag,
  LogOut,
  IndianRupee,
  Search,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
  referral_code?: string;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${d.getFullYear()}-${mm}`;
  });

  // Orders
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Referral Stats
  const [referralStats, setReferralStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Check if session stored admin auth
    const savedAuth = localStorage.getItem('empire_admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadOrders();
      loadReferralStats();
    }
  }, [isAuthenticated, selectedMonth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      setLoginError('Please enter admin email');
      return;
    }
    // Grant access (matches empire admin login)
    setIsAuthenticated(true);
    localStorage.setItem('empire_admin_authenticated', 'true');
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('empire_admin_authenticated');
  };

  const loadStats = async () => {
    try {
      // Total orders count
      const { count: total } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Pending count
      const { count: pending } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch all total_amounts & created_at
      const { data } = await supabase.from('orders').select('total_amount, created_at');

      let overall = 0;
      let monthSum = 0;

      const [selYear, selMonth] = selectedMonth.split('-').map(Number);

      if (data) {
        data.forEach((o) => {
          const amt = Number(o.total_amount) || 0;
          overall += amt;

          if (o.created_at) {
            const date = new Date(o.created_at);
            if (date.getFullYear() === selYear && date.getMonth() + 1 === selMonth) {
              monthSum += amt;
            }
          }
        });
      }

      setTotalOrders(total || (data ? data.length : 0));
      setPendingOrders(pending || 0);
      setTotalSales(overall);
      setMonthlySales(monthSum);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setOrders(data as OrderItem[]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadReferralStats = async () => {
    const defaultCodes = ['ANTY07', 'AMRIT09', 'KRISHV19', 'AVANI26', 'SANJEEVANI26', 'VEDU18'];
    const counts: Record<string, number> = {};
    defaultCodes.forEach((c) => (counts[c] = 0));

    try {
      const { data } = await supabase.from('orders').select('referral_code');
      if (data) {
        data.forEach((o) => {
          const code = (o.referral_code || '').trim().toUpperCase();
          if (code && counts.hasOwnProperty(code)) {
            counts[code]++;
          }
        });
      }
    } catch (err) {
      console.error('Error loading referral stats:', err);
    }
    setReferralStats(counts);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        loadStats();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllOrders = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
    }
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!confirm(`Delete ${selectedOrderIds.length} selected orders?`)) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .in('id', selectedOrderIds);

      if (!error) {
        setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id)));
        setSelectedOrderIds([]);
        loadStats();
      }
    } catch (err) {
      console.error('Error deleting orders:', err);
    }
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-charcoal-900 border border-gold-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">E'MPIRE Admin</h1>
          <p className="text-xs text-gray-400 mb-6">Enter admin credentials to access panel</p>

          {loginError && (
            <div className="mb-4 p-2.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-black border border-gray-800 focus:border-gold-400 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-semibold py-3 rounded-lg text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Enter Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                E'MPIRE Admin Dashboard
              </h1>
              <p className="text-xs text-gray-400">Manage sales, orders, products & revenue metrics</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* 1. SALES PERFORMANCE & SUMMARY SECTION */}
        <SalesPerformanceSection />

        {/* 3. REFERRAL CODE STATS & ORDERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Code Table */}
          <div className="bg-charcoal-800/80 border border-gray-800 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gold-400 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Referral Code Usage
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase">
                    <th className="pb-2">Code</th>
                    <th className="pb-2 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {Object.entries(referralStats).map(([code, count]) => (
                    <tr key={code} className="hover:bg-black/30">
                      <td className="py-2.5 font-mono text-gold-300">{code}</td>
                      <td className="py-2.5 text-right font-medium">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders Table */}
          <div className="lg:col-span-2 bg-charcoal-800/80 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gold-400" /> Recent Orders
              </h3>
              <div className="flex items-center gap-2">
                {selectedOrderIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedOrders}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedOrderIds.length})
                  </button>
                )}
                <button
                  onClick={loadOrders}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase">
                    <th className="pb-2 w-8">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAllOrders}
                        checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                        className="rounded accent-gold-500"
                      />
                    </th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        {loadingOrders ? 'Loading orders...' : 'No orders found.'}
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-black/30">
                        <td className="py-2.5">
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.includes(o.id)}
                            onChange={() => toggleSelectOrder(o.id)}
                            className="rounded accent-gold-500"
                          />
                        </td>
                        <td className="py-2.5">
                          <div className="font-medium text-white">{o.customer_name || 'Anonymous'}</div>
                          <div className="text-[11px] text-gray-400">{o.email || o.phone || 'N/A'}</div>
                        </td>
                        <td className="py-2.5 font-semibold text-gold-400">
                          ₹{(o.total_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                              o.status === 'confirmed'
                                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                                : o.status === 'shipped'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {o.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-2.5 text-right space-x-1">
                          <button
                            onClick={() => handleStatusChange(o.id, 'confirmed')}
                            className="px-2 py-1 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-[10px] rounded font-semibold border border-gold-500/30 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(o.id, 'shipped')}
                            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] rounded font-semibold border border-blue-500/30 transition"
                          >
                            Ship
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
