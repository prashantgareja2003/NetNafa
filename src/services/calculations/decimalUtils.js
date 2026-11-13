/**
 * Decimal-safe arithmetic utilities to prevent floating-point anomalies
 * in Indian stock and tax calculations.
 */

export const safeNumber = (val, fallback = 0) => {
  if (val === undefined || val === null || val === '') return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

export const roundCurrency = (val) => {
  const num = safeNumber(val);
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const roundToPrecision = (val, precision = 4) => {
  const num = safeNumber(val);
  const factor = Math.pow(10, precision);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

export const addMoney = (a, b) => {
  const nA = Math.round(safeNumber(a) * 100);
  const nB = Math.round(safeNumber(b) * 100);
  return (nA + nB) / 100;
};

export const subtractMoney = (a, b) => {
  const nA = Math.round(safeNumber(a) * 100);
  const nB = Math.round(safeNumber(b) * 100);
  return (nA - nB) / 100;
};

export const multiplyMoney = (amount, multiplier) => {
  const val = safeNumber(amount) * safeNumber(multiplier);
  return roundCurrency(val);
};

export const divideMoney = (amount, divisor) => {
  const d = safeNumber(divisor);
  if (d === 0) return 0;
  return roundToPrecision(safeNumber(amount) / d, 4);
};
