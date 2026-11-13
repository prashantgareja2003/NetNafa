import {
  safeNumber,
  roundCurrency,
  addMoney,
  subtractMoney,
  multiplyMoney
} from './decimalUtils';

/**
 * Indian Equity Capital Gains Tax Calculation Engine.
 * Implements:
 * - Sec 111A (STCG)
 * - Sec 112A (LTCG with Exemption)
 * - Intra-head loss set-off (Sec 70):
 *     1. LTCL can set-off ONLY against LTCG.
 *     2. STCL can set-off against STCG, then remaining against LTCG.
 * - Surcharge and 4% Health & Education Cess.
 */
export const calculateTaxForFinancialYear = (realizedTrades = [], targetFY = '2026-27', taxRules = {}) => {
  const rule = taxRules[targetFY] || {
    financialYear: targetFY,
    stcgRate: 20.0,
    ltcgRate: 12.5,
    ltcgExemptionLimit: 125000,
    cessRate: 4.0,
    surchargeRate: 0.0
  };

  // 1. Filter realized trades belonging to the target FY
  const fyTrades = realizedTrades.filter(t => t.financialYear === targetFY);

  let grossStcg = 0;
  let grossStcl = 0; // Negative number
  let grossLtcg = 0;
  let grossLtcl = 0; // Negative number

  const stcgTrades = [];
  const stclTrades = [];
  const ltcgTrades = [];
  const ltclTrades = [];

  for (const trade of fyTrades) {
    const pnl = trade.realizedPnL;
    if (trade.isLtcg) {
      if (pnl >= 0) {
        grossLtcg = addMoney(grossLtcg, pnl);
        ltcgTrades.push(trade);
      } else {
        grossLtcl = addMoney(grossLtcl, Math.abs(pnl));
        ltclTrades.push(trade);
      }
    } else {
      if (pnl >= 0) {
        grossStcg = addMoney(grossStcg, pnl);
        stcgTrades.push(trade);
      } else {
        grossStcl = addMoney(grossStcl, Math.abs(pnl));
        stclTrades.push(trade);
      }
    }
  }

  // 2. Intra-head Loss Set-Off Logic:
  // Step A: Set off LTCL against LTCG
  let ltcgAfterLtcl = 0;
  let unabsorbedLtcl = 0;
  if (grossLtcl <= grossLtcg) {
    ltcgAfterLtcl = subtractMoney(grossLtcg, grossLtcl);
    unabsorbedLtcl = 0;
  } else {
    ltcgAfterLtcl = 0;
    unabsorbedLtcl = subtractMoney(grossLtcl, grossLtcg);
  }

  // Step B: Set off STCL against STCG
  let stcgAfterStcl = 0;
  let remainingStcl = 0;
  if (grossStcl <= grossStcg) {
    stcgAfterStcl = subtractMoney(grossStcg, grossStcl);
    remainingStcl = 0;
  } else {
    stcgAfterStcl = 0;
    remainingStcl = subtractMoney(grossStcl, grossStcg);
  }

  // Step C: Set off remaining STCL against remaining LTCG (as permitted under Sec 70(2))
  let netLtcgBeforeExemption = ltcgAfterLtcl;
  let unabsorbedStcl = 0;
  let stclSetOffAgainstLtcg = 0;

  if (remainingStcl > 0) {
    if (remainingStcl <= netLtcgBeforeExemption) {
      stclSetOffAgainstLtcg = remainingStcl;
      netLtcgBeforeExemption = subtractMoney(netLtcgBeforeExemption, remainingStcl);
      unabsorbedStcl = 0;
    } else {
      stclSetOffAgainstLtcg = netLtcgBeforeExemption;
      unabsorbedStcl = subtractMoney(remainingStcl, netLtcgBeforeExemption);
      netLtcgBeforeExemption = 0;
    }
  }

  const netTaxableStcg = roundCurrency(stcgAfterStcl);

  // 3. Section 112A LTCG Exemption
  const exemptionLimit = safeNumber(rule.ltcgExemptionLimit, 125000);
  const eligibleLtcgExemption = Math.min(netLtcgBeforeExemption, exemptionLimit);
  const netTaxableLtcg = Math.max(0, subtractMoney(netLtcgBeforeExemption, eligibleLtcgExemption));

  // 4. Tax Rate Computations
  const stcgRate = safeNumber(rule.stcgRate, 20.0);
  const ltcgRate = safeNumber(rule.ltcgRate, 12.5);
  const cessRate = safeNumber(rule.cessRate, 4.0);

  const taxOnStcg = roundCurrency(netTaxableStcg * (stcgRate / 100));
  const taxOnLtcg = roundCurrency(netTaxableLtcg * (ltcgRate / 100));
  const baseTax = addMoney(taxOnStcg, taxOnLtcg);

  // 5. Surcharge Calculation (Applicable if taxable gains > 50L or user custom surcharge)
  let effectiveSurchargeRate = safeNumber(rule.surchargeRate, 0);
  const totalTaxableGains = addMoney(netTaxableStcg, netTaxableLtcg);
  if (effectiveSurchargeRate === 0 && totalTaxableGains > 5000000) {
    if (totalTaxableGains <= 10000000) effectiveSurchargeRate = 10;
    else effectiveSurchargeRate = 15; // Capped at 15% for 111A / 112A in India
  }

  const surchargeAmount = roundCurrency(baseTax * (effectiveSurchargeRate / 100));
  const taxPlusSurcharge = addMoney(baseTax, surchargeAmount);

  // 6. Health & Education Cess
  const cessAmount = roundCurrency(taxPlusSurcharge * (cessRate / 100));
  const totalTaxLiability = addMoney(taxPlusSurcharge, cessAmount);

  return {
    financialYear: targetFY,
    rule,
    // Gross figures
    grossStcg: roundCurrency(grossStcg),
    grossStcl: roundCurrency(grossStcl),
    grossLtcg: roundCurrency(grossLtcg),
    grossLtcl: roundCurrency(grossLtcl),
    totalGrossProfit: addMoney(grossStcg, grossLtcg),
    totalGrossLoss: addMoney(grossStcl, grossLtcl),
    // Set-off details
    ltclSetOffAgainstLtcg: subtractMoney(grossLtcl, unabsorbedLtcl),
    stclSetOffAgainstStcg: subtractMoney(grossStcl, remainingStcl),
    stclSetOffAgainstLtcg: roundCurrency(stclSetOffAgainstLtcg),
    unabsorbedLtcl: roundCurrency(unabsorbedLtcl),
    unabsorbedStcl: roundCurrency(unabsorbedStcl),
    totalLossToCarryForward: addMoney(unabsorbedLtcl, unabsorbedStcl),
    // Taxable Bases
    netTaxableStcg: netTaxableStcg,
    netLtcgBeforeExemption: roundCurrency(netLtcgBeforeExemption),
    eligibleLtcgExemption: roundCurrency(eligibleLtcgExemption),
    netTaxableLtcg: roundCurrency(netTaxableLtcg),
    totalTaxableCapitalGains: roundCurrency(totalTaxableGains),
    // Taxes
    taxOnStcg: taxOnStcg,
    taxOnLtcg: taxOnLtcg,
    baseTax: baseTax,
    effectiveSurchargeRate: effectiveSurchargeRate,
    surchargeAmount: surchargeAmount,
    cessRate: cessRate,
    cessAmount: cessAmount,
    totalTaxLiability: totalTaxLiability,
    // Trade records
    tradesCount: fyTrades.length,
    stcgTrades,
    stclTrades,
    ltcgTrades,
    ltclTrades
  };
};
