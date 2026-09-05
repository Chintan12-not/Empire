'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  Edit3,
  Check,
  AlertCircle,
  BarChart2,
  Clock,
  Sparkles,
  Save,
  X,
} from 'lucide-react';
import {
  SalesPerformanceInput,
  CalculatedSalesMetrics,
  DEFAULT_SALES_PERFORMANCE,
  getSalesPerformance,
  updateSalesPerformance,
  calculateSalesMetrics,
  formatINR,
  formatNumberIN,
  validateSalesInput,
} from '@/lib/salesService';

export default function SalesPerformanceSection() {
  const [data, setData] = useState<SalesPerformanceInput>(DEFAULT_SALES_PERFORMANCE);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<SalesPerformanceInput>(DEFAULT_SALES_PERFORMANCE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch sales performance data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getSalesPerformance();
      setData(res);
      setFormData(res);
      setLoading(false);
    }
    loadData();
  }, []);

  const metrics: CalculatedSalesMetrics = calculateSalesMetrics(data);
  const previewMetrics: CalculatedSalesMetrics = calculateSalesMetrics(formData);

  const handleOpenEdit = () => {
    setFormData(data);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(data);
    setErrorMessage(null);
    setEditing(false);
  };

  const handleChange = (field: keyof SalesPerformanceInput, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const updated = { ...formData, [field]: numValue };
    setFormData(updated);

    const val = validateSalesInput(updated);
    if (!val.valid) {
      setErrorMessage(val.error || 'Invalid input');
    } else {
      setErrorMessage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateSalesInput(formData);
    if (!val.valid) {
      setErrorMessage(val.error || 'Please correct the values.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await updateSalesPerformance(formData);
    setSaving(false);

    if (res.success) {
      setData(formData);
      setEditing(false);
      setSuccessMessage('Sales performance updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to update sales performance.');
    }
  };

  if (loading) {
    return (
      <div className="bg-charcoal-800/60 border border-gold-500/20 rounded-2xl p-6 animate-pulse text-center text-gray-400">
        Loading Sales Performance data...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-charcoal-800/90 to-charcoal-900 border border-gold-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl mb-8 backdrop-blur-md relative overflow-hidden">
      {/* Decorative Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-amber-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Sales Performance & Summary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Dynamic sales analytics, revenue breakdown & performance metrics
          </p>
        </div>

        {!editing && (
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/40 hover:border-gold-400 transition-all shadow-md active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            Edit Sales Data
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {successMessage && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Edit Form Modal / Inline Panel */}
      {editing ? (
        <form onSubmit={handleSave} className="bg-black/50 border border-gold-500/30 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
            <h3 className="text-base font-semibold text-gold-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Edit Sales Summary Base Values
            </h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                Sales Period (Months)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.salesPeriodMonths}
                onChange={(e) => handleChange('salesPeriodMonths', e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 focus:border-gold-400 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-400 transition"
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Total duration in months (e.g. 3)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-gold-400" />
                Total Bottles Sold
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.totalBottlesSold}
                onChange={(e) => handleChange('totalBottlesSold', e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 focus:border-gold-400 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-400 transition"
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Cannot be negative (e.g. 3500)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-gold-400" />
                Price Per Bottle (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerBottle}
                onChange={(e) => handleChange('pricePerBottle', e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 focus:border-gold-400 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-400 transition"
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Cannot be negative (e.g. 1170)
              </span>
            </div>
          </div>

          {/* Real-time Calculation Preview */}
          <div className="bg-charcoal-900/90 border border-gold-500/20 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Calculated Preview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Total Revenue:</span>
                <span className="text-gold-400 font-bold text-sm">
                  {formatINR(previewMetrics.totalRevenue)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Avg Bottles/Mo:</span>
                <span className="text-white font-medium text-sm">
                  ~{formatNumberIN(previewMetrics.avgBottlesPerMonth)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Avg Revenue/Mo:</span>
                <span className="text-white font-medium text-sm">
                  {formatINR(previewMetrics.avgRevenuePerMonth)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Avg Daily Revenue:</span>
                <span className="text-white font-medium text-sm">
                  ~{formatINR(previewMetrics.avgRevenuePerDay)}/day
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !!errorMessage}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gold-500 hover:bg-gold-400 text-charcoal-950 transition shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Calculate'}
            </button>
          </div>
        </form>
      ) : null}

      {/* Primary KPI Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Sales Period */}
        <div className="bg-charcoal-900/80 border border-gray-800 hover:border-gold-500/30 rounded-xl p-4 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Sales Period
            </span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {metrics.salesPeriodMonths}{' '}
            <span className="text-sm font-normal text-gray-400">
              {metrics.salesPeriodMonths === 1 ? 'Month' : 'Months'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            Standard {metrics.daysInPeriod} days window
          </div>
        </div>

        {/* Card 2: Total Bottles Sold */}
        <div className="bg-charcoal-900/80 border border-gray-800 hover:border-gold-500/30 rounded-xl p-4 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total Bottles Sold
            </span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatNumberIN(metrics.totalBottlesSold)}{' '}
            <span className="text-sm font-normal text-gray-400">bottles</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Across all luxury scents
          </div>
        </div>

        {/* Card 3: Price Per Bottle */}
        <div className="bg-charcoal-900/80 border border-gray-800 hover:border-gold-500/30 rounded-xl p-4 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Price Per Bottle
            </span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatINR(metrics.pricePerBottle)}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Average realization per unit
          </div>
        </div>

        {/* Card 4: Total Revenue (Dynamically Calculated) */}
        <div className="bg-gradient-to-br from-gold-950/40 via-charcoal-900 to-charcoal-900 border border-gold-500/50 hover:border-gold-400 rounded-xl p-4 transition-all duration-300 group shadow-lg shadow-gold-500/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Total Sales Revenue
            </span>
            <span className="p-2 rounded-lg bg-gold-500/20 text-gold-300 border border-gold-500/40 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200 tracking-tight">
            {formatINR(metrics.totalRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-gold-400/80 font-medium flex items-center gap-1">
            <span>Formula: {formatNumberIN(metrics.totalBottlesSold)} × {formatINR(metrics.pricePerBottle)}</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics / Calculated Insights Grid */}
      <div className="bg-black/40 border border-gray-800/80 rounded-xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" /> Calculated Sales Rate & Averages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Metric 1 */}
          <div className="bg-charcoal-900/60 border border-gray-800/60 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 mb-1">Avg Bottles / Month</div>
            <div className="text-base font-semibold text-white">
              ~{formatNumberIN(metrics.avgBottlesPerMonth)} <span className="text-xs text-gray-400 font-normal">bottles</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Per 30-day block</div>
          </div>

          {/* Metric 2 */}
          <div className="bg-charcoal-900/60 border border-gray-800/60 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 mb-1">Avg Revenue / Month</div>
            <div className="text-base font-semibold text-gold-400">
              {formatINR(metrics.avgRevenuePerMonth)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Monthly run rate</div>
          </div>

          {/* Metric 3 */}
          <div className="bg-charcoal-900/60 border border-gray-800/60 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 mb-1">Avg Bottles / Day</div>
            <div className="text-base font-semibold text-white">
              ~{Math.round(metrics.avgBottlesPerDay)} <span className="text-xs text-gray-400 font-normal">bottles/day</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Based on {metrics.daysInPeriod} days</div>
          </div>

          {/* Metric 4 */}
          <div className="bg-charcoal-900/60 border border-gray-800/60 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 mb-1">Avg Daily Revenue</div>
            <div className="text-base font-semibold text-gold-400">
              ~{formatINR(metrics.avgRevenuePerDay)}<span className="text-xs text-gray-400 font-normal">/day</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Daily run rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
