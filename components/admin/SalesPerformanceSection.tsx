'use client';

import React from 'react';
import {
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  BarChart2,
  Clock,
} from 'lucide-react';
import {
  DEFAULT_SALES_PERFORMANCE,
  calculateSalesMetrics,
  formatINR,
  formatNumberIN,
} from '@/lib/salesService';

export default function SalesPerformanceSection() {
  const metrics = calculateSalesMetrics(DEFAULT_SALES_PERFORMANCE);

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
      </div>

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
            <span className="text-sm font-normal text-gray-400">Months</span>
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
