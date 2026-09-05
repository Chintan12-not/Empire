import { supabase } from './supabaseClient';

export interface SalesPerformanceInput {
  salesPeriodMonths: number;
  totalBottlesSold: number;
  pricePerBottle: number;
}

export interface CalculatedSalesMetrics {
  salesPeriodMonths: number;
  totalBottlesSold: number;
  pricePerBottle: number;
  totalRevenue: number;
  avgBottlesPerMonth: number;
  avgRevenuePerMonth: number;
  avgBottlesPerDay: number;
  avgRevenuePerDay: number;
  daysInPeriod: number;
}

const STORAGE_KEY = 'empire_sales_performance_v1';

export const DEFAULT_SALES_PERFORMANCE: SalesPerformanceInput = {
  salesPeriodMonths: 3,
  totalBottlesSold: 3500,
  pricePerBottle: 1170,
};

/**
 * Validates input parameters for Sales Performance
 */
export function validateSalesInput(input: Partial<SalesPerformanceInput>): { valid: boolean; error?: string } {
  if (input.salesPeriodMonths !== undefined && (input.salesPeriodMonths < 1 || isNaN(input.salesPeriodMonths))) {
    return { valid: false, error: 'Sales period must be at least 1 month.' };
  }
  if (input.totalBottlesSold !== undefined && (input.totalBottlesSold < 0 || isNaN(input.totalBottlesSold))) {
    return { valid: false, error: 'Total bottles sold cannot be negative.' };
  }
  if (input.pricePerBottle !== undefined && (input.pricePerBottle < 0 || isNaN(input.pricePerBottle))) {
    return { valid: false, error: 'Price per bottle cannot be negative.' };
  }
  return { valid: true };
}

/**
 * Calculates metrics dynamically from base values
 */
export function calculateSalesMetrics(input: SalesPerformanceInput): CalculatedSalesMetrics {
  const months = Math.max(1, input.salesPeriodMonths || 3);
  const bottles = Math.max(0, input.totalBottlesSold || 0);
  const price = Math.max(0, input.pricePerBottle || 0);

  const totalRevenue = bottles * price;
  const avgBottlesPerMonth = bottles / months;
  const avgRevenuePerMonth = totalRevenue / months;

  const daysInPeriod = months * 30; // Standard 30 days per month
  const avgBottlesPerDay = bottles / daysInPeriod;
  const avgRevenuePerDay = totalRevenue / daysInPeriod;

  return {
    salesPeriodMonths: months,
    totalBottlesSold: bottles,
    pricePerBottle: price,
    totalRevenue,
    avgBottlesPerMonth,
    avgRevenuePerMonth,
    avgBottlesPerDay,
    avgRevenuePerDay,
    daysInPeriod,
  };
}

/**
 * Helper to format currency in Indian style (₹)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Helper to format integer values in Indian locale
 */
export function formatNumberIN(amount: number): string {
  if (isNaN(amount)) return '0';
  return Math.round(amount).toLocaleString('en-IN');
}

/**
 * Fetch Sales Performance from Supabase with LocalStorage & Fallback support
 */
export async function getSalesPerformance(): Promise<SalesPerformanceInput> {
  let dataFromStorage: SalesPerformanceInput | null = null;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dataFromStorage = JSON.parse(stored);
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  try {
    const { data, error } = await supabase
      .from('sales_performance')
      .select('sales_period_months, total_bottles_sold, price_per_bottle')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      const result: SalesPerformanceInput = {
        salesPeriodMonths: Number(data.sales_period_months) || DEFAULT_SALES_PERFORMANCE.salesPeriodMonths,
        totalBottlesSold: Number(data.total_bottles_sold) ?? DEFAULT_SALES_PERFORMANCE.totalBottlesSold,
        pricePerBottle: Number(data.price_per_bottle) ?? DEFAULT_SALES_PERFORMANCE.pricePerBottle,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      }
      return result;
    }
  } catch (e) {
    console.warn('Could not fetch sales_performance from Supabase, using cached/default:', e);
  }

  return dataFromStorage || DEFAULT_SALES_PERFORMANCE;
}

/**
 * Save / Update Sales Performance to Supabase & LocalStorage
 */
export async function updateSalesPerformance(input: SalesPerformanceInput): Promise<{ success: boolean; error?: string }> {
  const validation = validateSalesInput(input);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Update localStorage immediately for fast UI reflection
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }

  try {
    // Check if a record exists
    const { data: existing } = await supabase
      .from('sales_performance')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('sales_performance')
        .update({
          sales_period_months: input.salesPeriodMonths,
          total_bottles_sold: input.totalBottlesSold,
          price_per_bottle: input.pricePerBottle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('sales_performance')
        .insert([
          {
            sales_period_months: input.salesPeriodMonths,
            total_bottles_sold: input.totalBottlesSold,
            price_per_bottle: input.pricePerBottle,
          },
        ]);

      if (error) throw error;
    }

    return { success: true };
  } catch (e: any) {
    console.warn('Supabase update failed, persisted locally:', e);
    // Even if Supabase fails (table missing/RLS issue), local persistence succeeded
    return { success: true, error: 'Saved locally. (Note: Supabase table sync failed or table missing)' };
  }
}
