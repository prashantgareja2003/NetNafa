/**
 * Indian Equity Capital Gains Tax Rules Configuration.
 * Fully configurable and versioned by Financial Year.
 * Includes Section 111A (STCG) and Section 112A (LTCG).
 */

export const DEFAULT_TAX_RULES = {
  '2026-27': {
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    effectiveFrom: '2026-04-01',
    holdingPeriodMonthsEquity: 12, // Listed equity shares
    stcgRate: 20.0, // Section 111A (Post Budget 2024)
    ltcgRate: 12.5, // Section 112A (Post Budget 2024)
    ltcgExemptionLimit: 125000, // ₹1,25,000 under Section 112A
    cessRate: 4.0, // Health & Education Cess
    surchargeRate: 0.0, // Default base surcharge, user adjustable or slab-computed
    notes: 'Union Budget 2024 enacted rates: STCG at 20%, LTCG at 12.5% with ₹1.25L annual exemption for listed equity with STT.'
  },
  '2025-26': {
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    effectiveFrom: '2025-04-01',
    holdingPeriodMonthsEquity: 12,
    stcgRate: 20.0,
    ltcgRate: 12.5,
    ltcgExemptionLimit: 125000,
    cessRate: 4.0,
    surchargeRate: 0.0,
    notes: 'STCG at 20%, LTCG at 12.5% with ₹1.25 Lakh exemption threshold.'
  },
  '2024-25': {
    financialYear: '2024-25',
    assessmentYear: '2025-26',
    effectiveFrom: '2024-04-01',
    holdingPeriodMonthsEquity: 12,
    stcgRate: 20.0,
    ltcgRate: 12.5,
    ltcgExemptionLimit: 125000,
    cessRate: 4.0,
    surchargeRate: 0.0,
    notes: 'Post-July 23, 2024 rates applied: STCG 20%, LTCG 12.5% with ₹1.25L exemption.'
  },
  '2023-24': {
    financialYear: '2023-24',
    assessmentYear: '2024-25',
    effectiveFrom: '2023-04-01',
    holdingPeriodMonthsEquity: 12,
    stcgRate: 15.0,
    ltcgRate: 10.0,
    ltcgExemptionLimit: 100000,
    cessRate: 4.0,
    surchargeRate: 0.0,
    notes: 'Legacy tax rates: STCG under Sec 111A at 15%, LTCG under Sec 112A at 10% with ₹1 Lakh exemption threshold.'
  }
};

export const AVAILABLE_FINANCIAL_YEARS = [
  '2026-27',
  '2025-26',
  '2024-25',
  '2023-24'
];

export const TRANSACTION_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
  BONUS: 'BONUS',
  SPLIT: 'SPLIT',
  GIFT_RECEIVED: 'GIFT_RECEIVED',
  GIFT_TRANSFERRED: 'GIFT_TRANSFERRED',
  IPO_ALLOTMENT: 'IPO_ALLOTMENT',
  CORPORATE_ACTION: 'CORPORATE_ACTION'
};

export const INVESTMENT_TYPES = [
  { value: 'EQUITY', label: 'Equity (Secondary Market)' },
  { value: 'IPO', label: 'IPO Allotment' },
  { value: 'BONUS', label: 'Bonus Shares' },
  { value: 'GIFTED', label: 'Gifted / Inherited Shares' },
  { value: 'OTHER', label: 'Other Corporate Actions' }
];

export const SECTORS = [
  'Information Technology',
  'Banking & Financial Services',
  'Automobiles & Auto Components',
  'Pharmaceuticals & Healthcare',
  'Energy, Oil & Gas',
  'Fast Moving Consumer Goods (FMCG)',
  'Metals & Mining',
  'Infrastructure & Construction',
  'Telecommunications',
  'Consumer Durables & Retail',
  'Chemicals & Fertilizers',
  'Power & Utilities',
  'Services & Others'
];
