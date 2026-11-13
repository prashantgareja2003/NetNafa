import { safeNumber } from '../../services/calculations/decimalUtils';

/**
 * Formats a number to Indian Rupee standard format (Lakhs and Crores).
 * Example: 125000 -> ₹1,25,000.00
 */
export const formatINR = (value, showSymbol = true, decimals = 2) => {
  const num = safeNumber(value);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const fixed = absNum.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');

  // Indian number formatting: last 3 digits, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  let formattedInteger = lastThree;

  if (otherNumbers !== '') {
    formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const result = (decimals > 0 && decimalPart !== undefined)
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  const sign = isNegative ? '-' : '';
  const prefix = showSymbol ? '₹' : '';

  return `${sign}${prefix}${result}`;
};

/**
 * Compact Indian currency formatting (e.g., ₹12.50 L, ₹1.45 Cr)
 */
export const formatINRCompact = (value, showSymbol = true) => {
  const num = safeNumber(value);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const prefix = showSymbol ? '₹' : '';

  if (abs >= 10000000) {
    return `${sign}${prefix}${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}${prefix}${(abs / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `${sign}${prefix}${(abs / 1000).toFixed(1)} K`;
  }
  return formatINR(value, showSymbol, 2);
};

/**
 * Formats percentage with + or - sign
 */
export const formatPercent = (value, showSign = true) => {
  const num = safeNumber(value);
  const sign = num > 0 && showSign ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Formats a Date object or YYYY-MM-DD string to readable Indian date (e.g., 15-Aug-2026)
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';
  
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Determines Financial Year for an Indian tax date.
 * E.g., 2026-05-10 -> '2026-27'
 * 2026-02-15 -> '2025-26'
 */
export const getFinancialYear = (dateInput) => {
  if (!dateInput) return '2026-27';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '2026-27';

  const month = d.getMonth(); // 0 is January, 3 is April
  const year = d.getFullYear();

  if (month >= 3) {
    // April (3) to December (11)
    const nextYearShort = String((year + 1) % 100).padStart(2, '0');
    return `${year}-${nextYearShort}`;
  } else {
    // January (0) to March (2)
    const curYearShort = String(year % 100).padStart(2, '0');
    return `${year - 1}-${curYearShort}`;
  }
};

/**
 * Calculates months between two dates for LTCG/STCG determination
 */
export const getHoldingPeriodMonths = (purchaseDate, saleDate) => {
  const d1 = new Date(purchaseDate);
  const d2 = new Date(saleDate);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() < d1.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
};

/**
 * Calculates exact holding days
 */
export const getHoldingDays = (purchaseDate, saleDate) => {
  const d1 = new Date(purchaseDate);
  const d2 = new Date(saleDate);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

  const diffTime = d2.getTime() - d1.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};
