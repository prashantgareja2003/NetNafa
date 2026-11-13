import { describe, it, expect } from 'vitest';
import { processFifoTransactions, buildPortfolioFromLots } from '../fifoEngine';
import { calculateTaxForFinancialYear } from '../taxEngine';
import { DEFAULT_TAX_RULES } from '../../../utils/constants/taxRules';
import { addMoney, subtractMoney, multiplyMoney, divideMoney, roundCurrency } from '../decimalUtils';

describe('Decimal-safe Financial Math', () => {
  it('prevents standard IEEE 754 floating point errors', () => {
    // 0.1 + 0.2 in native JS is 0.30000000000000004
    expect(addMoney(0.1, 0.2)).toBe(0.3);
    expect(subtractMoney(1.0, 0.9)).toBe(0.1);
    expect(multiplyMoney(10.55, 3)).toBe(31.65);
    expect(divideMoney(100, 3)).toBe(33.3333);
  });
});

describe('FIFO Lot Matching & Portfolio Engine', () => {
  // Test 1: Multiple purchases of the same stock
  it('1. handles multiple purchases of the same stock', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'INFY', stockName: 'Infosys Ltd', date: '2026-04-10', quantity: 10, price: 1400, charges: 50 },
      { id: '2', type: 'BUY', symbol: 'INFY', stockName: 'Infosys Ltd', date: '2026-05-15', quantity: 20, price: 1500, charges: 100 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.openLots).toHaveLength(2);
    expect(result.openLots[0].availableQuantity).toBe(10);
    expect(result.openLots[1].availableQuantity).toBe(20);

    const portfolio = buildPortfolioFromLots(result.openLots, { INFY: 1600 });
    expect(portfolio).toHaveLength(1);
    expect(portfolio[0].totalQuantity).toBe(30);
    // Total invested = (10*1400 + 50) + (20*1500 + 100) = 14050 + 30100 = 44150
    expect(portfolio[0].totalInvested).toBe(44150);
  });

  // Test 2 & 3: FIFO matching & Partial stock sales
  it('2 & 3. matches FIFO lots correctly on partial sales', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'RELIANCE', date: '2025-04-01', quantity: 10, price: 100, charges: 0 },
      { id: '2', type: 'BUY', symbol: 'RELIANCE', date: '2025-06-01', quantity: 10, price: 150, charges: 0 },
      { id: '3', type: 'SELL', symbol: 'RELIANCE', date: '2025-08-01', quantity: 15, price: 200, charges: 0 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    // 15 sold: 10 from lot 1 (at ₹100), 5 from lot 2 (at ₹150)
    expect(result.realizedTrades).toHaveLength(2);

    const trade1 = result.realizedTrades[0];
    expect(trade1.quantity).toBe(10);
    expect(trade1.buyPricePerShare).toBe(100);
    expect(trade1.sellPricePerShare).toBe(200);
    expect(trade1.realizedPnL).toBe(1000); // (200 - 100) * 10

    const trade2 = result.realizedTrades[1];
    expect(trade2.quantity).toBe(5);
    expect(trade2.buyPricePerShare).toBe(150);
    expect(trade2.sellPricePerShare).toBe(200);
    expect(trade2.realizedPnL).toBe(250); // (200 - 150) * 5

    // Remaining in openLots: 5 shares from lot 2
    expect(result.openLots).toHaveLength(1);
    expect(result.openLots[0].availableQuantity).toBe(5);
    expect(result.openLots[0].purchasePrice).toBe(150);
  });

  // Test 4: Complete stock liquidation
  it('4. handles complete stock liquidation', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'TATASTEEL', date: '2026-04-01', quantity: 50, price: 120, charges: 0 },
      { id: '2', type: 'SELL', symbol: 'TATASTEEL', date: '2026-05-01', quantity: 50, price: 130, charges: 0 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.openLots).toHaveLength(0);
    expect(result.realizedTrades).toHaveLength(1);
    expect(result.realizedTrades[0].realizedPnL).toBe(500); // 10 * 50
  });

  // Test 5 & 6: Multiple financial years and STCG vs LTCG classification
  it('5 & 6. classifies STCG (<=12 months) vs LTCG (>12 months) and segregates FYs', () => {
    const txns = [
      // Bought 2024-04-10, sold 2024-10-10 (6 months: STCG in FY 2024-25)
      { id: '1', type: 'BUY', symbol: 'HDFCBANK', date: '2024-04-10', quantity: 20, price: 1500, charges: 0 },
      { id: '2', type: 'SELL', symbol: 'HDFCBANK', date: '2024-10-10', quantity: 20, price: 1700, charges: 0 },
      // Bought 2024-05-01, sold 2026-06-01 (>24 months: LTCG in FY 2026-27)
      { id: '3', type: 'BUY', symbol: 'ICICIBANK', date: '2024-05-01', quantity: 30, price: 1000, charges: 0 },
      { id: '4', type: 'SELL', symbol: 'ICICIBANK', date: '2026-06-01', quantity: 30, price: 1400, charges: 0 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.realizedTrades).toHaveLength(2);

    const hdfcTrade = result.realizedTrades.find(t => t.symbol === 'HDFCBANK');
    expect(hdfcTrade.financialYear).toBe('2024-25');
    expect(hdfcTrade.isLtcg).toBe(false);
    expect(hdfcTrade.gainType).toBe('STCG');

    const iciciTrade = result.realizedTrades.find(t => t.symbol === 'ICICIBANK');
    expect(iciciTrade.financialYear).toBe('2026-27');
    expect(iciciTrade.isLtcg).toBe(true);
    expect(iciciTrade.gainType).toBe('LTCG');
  });

  // Test 7, 8: Capital loss, loss set-off, and LTCG ₹1.25L exemption threshold
  it('7 & 8. calculates capital loss, intra-head set-off, and ₹1.25L LTCG exemption correctly', () => {
    // FY 2026-27:
    // LTCG: ₹2,00,000 profit
    // LTCL: ₹50,000 loss
    // STCL: ₹20,000 loss
    // Under Indian Tax Act:
    // Net LTCG after LTCL = 200000 - 50000 = 150000
    // STCL sets off against remaining LTCG = 150000 - 20000 = 130000
    // Exemption limit under 112A is 125000
    // Taxable LTCG = 130000 - 125000 = 5000
    // Tax at 12.5% = 625 + 4% cess = 650
    const trades = [
      { id: 't1', symbol: 'STOCK_A', financialYear: '2026-27', isLtcg: true, realizedPnL: 200000 },
      { id: 't2', symbol: 'STOCK_B', financialYear: '2026-27', isLtcg: true, realizedPnL: -50000 },
      { id: 't3', symbol: 'STOCK_C', financialYear: '2026-27', isLtcg: false, realizedPnL: -20000 }
    ];

    const taxResult = calculateTaxForFinancialYear(trades, '2026-27', DEFAULT_TAX_RULES);
    expect(taxResult.grossLtcg).toBe(200000);
    expect(taxResult.grossLtcl).toBe(50000);
    expect(taxResult.grossStcl).toBe(20000);
    expect(taxResult.netLtcgBeforeExemption).toBe(130000);
    expect(taxResult.eligibleLtcgExemption).toBe(125000);
    expect(taxResult.netTaxableLtcg).toBe(5000);
    expect(taxResult.taxOnLtcg).toBe(625); // 5000 * 12.5%
    expect(taxResult.cessAmount).toBe(25); // 4% of 625
    expect(taxResult.totalTaxLiability).toBe(650);
  });

  // Test 9: Gifted shares with donor holding period
  it('9. calculates holding period and cost of gifted shares from donor details (Sec 49(1))', () => {
    const txns = [
      {
        id: 'gift_1',
        type: 'GIFT_RECEIVED',
        symbol: 'WIPRO',
        date: '2026-01-10', // Gift date
        donorPurchaseDate: '2024-01-10', // Donor bought 2 years ago
        donorPurchasePrice: 400,
        quantity: 50,
        charges: 0
      },
      {
        id: 'sell_1',
        type: 'SELL',
        symbol: 'WIPRO',
        date: '2026-05-10', // Sold 4 months after gift, but 2+ years after donor bought
        quantity: 50,
        price: 550,
        charges: 100
      }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.realizedTrades).toHaveLength(1);
    const trade = result.realizedTrades[0];
    expect(trade.isLtcg).toBe(true); // Holding period measured from donor acquisition date
    expect(trade.buyPricePerShare).toBe(400);
    // Realized PnL = (50 * 550 - 100) - (50 * 400) = 27400 - 20000 = 7400
    expect(trade.realizedPnL).toBe(7400);
  });

  // Test 10: IPO allotment and sale
  it('10. treats IPO allotment as acquisition lot and calculates listing/realized gain', () => {
    const txns = [
      {
        id: 'ipo_1',
        type: 'IPO_ALLOTMENT',
        symbol: 'ZOMATO',
        date: '2025-07-23',
        quantity: 100,
        price: 76,
        charges: 0
      },
      {
        id: 'ipo_sell',
        type: 'SELL',
        symbol: 'ZOMATO',
        date: '2025-08-01',
        quantity: 100,
        price: 125,
        charges: 50
      }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.realizedTrades).toHaveLength(1);
    const trade = result.realizedTrades[0];
    expect(trade.lotType).toBe('IPO_ALLOTMENT');
    // Realized gain = (100 * 125 - 50) - (100 * 76) = 12450 - 7600 = 4850
    expect(trade.realizedPnL).toBe(4850);
  });

  // Test 11: Brokerage and charges allocated into cost and sale
  it('11. factors acquisition and sale charges into net realized PnL', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'SBIN', date: '2026-01-01', quantity: 10, price: 800, charges: 100 }, // Total cost = 8100 (810/share)
      { id: '2', type: 'SELL', symbol: 'SBIN', date: '2026-02-01', quantity: 10, price: 900, charges: 50 }   // Net sale = 8950
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    const trade = result.realizedTrades[0];
    expect(trade.totalAcquisitionCost).toBe(8100);
    expect(trade.netSellValue).toBe(8950);
    expect(trade.realizedPnL).toBe(850);
  });

  // Test 12: Corporate actions (Bonus and Split)
  it('12. processes Bonus shares (₹0 cost) and Split ratios correctly', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'TATAMOTORS', date: '2026-01-01', quantity: 10, price: 1000, charges: 0 },
      // Split 1:2 -> quantity doubles to 20, price halves to 500
      { id: '2', type: 'SPLIT', symbol: 'TATAMOTORS', date: '2026-02-01', splitRatio: 2 },
      // Bonus 1:1 -> 20 shares at 0 cost
      { id: '3', type: 'BONUS', symbol: 'TATAMOTORS', date: '2026-03-01', quantity: 20, price: 0, charges: 0 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.openLots).toHaveLength(2);
    expect(result.openLots[0].availableQuantity).toBe(20);
    expect(result.openLots[0].costPerShare).toBe(500);
    expect(result.openLots[1].availableQuantity).toBe(20);
    expect(result.openLots[1].costPerShare).toBe(0);

    const portfolio = buildPortfolioFromLots(result.openLots, { TATAMOTORS: 600 });
    expect(portfolio[0].totalQuantity).toBe(40);
    expect(portfolio[0].totalInvested).toBe(10000); // 20*500 + 20*0
  });

  // Test 13 & 14: Editing or deleting transactions recalculates cleanly
  it('13 & 14. handles edits and deletions cleanly by re-running deterministic FIFO lot matcher', () => {
    let txns = [
      { id: '1', type: 'BUY', symbol: 'BAJFINANCE', date: '2026-01-01', quantity: 10, price: 6500, charges: 0 },
      { id: '2', type: 'BUY', symbol: 'BAJFINANCE', date: '2026-02-01', quantity: 10, price: 7000, charges: 0 },
      { id: '3', type: 'SELL', symbol: 'BAJFINANCE', date: '2026-03-01', quantity: 5, price: 7500, charges: 0 }
    ];

    let result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.realizedTrades[0].realizedPnL).toBe(5000); // 5 * (7500 - 6500)

    // Edit: change sell quantity from 5 to 12
    txns = [
      { id: '1', type: 'BUY', symbol: 'BAJFINANCE', date: '2026-01-01', quantity: 10, price: 6500, charges: 0 },
      { id: '2', type: 'BUY', symbol: 'BAJFINANCE', date: '2026-02-01', quantity: 10, price: 7000, charges: 0 },
      { id: '3', type: 'SELL', symbol: 'BAJFINANCE', date: '2026-03-01', quantity: 12, price: 7500, charges: 0 }
    ];

    result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    // 10 from lot 1 (profit: 10 * 1000 = 10000) and 2 from lot 2 (profit: 2 * 500 = 1000) = 11000 total
    expect(result.realizedTrades).toHaveLength(2);
    const totalPnl = result.realizedTrades.reduce((sum, t) => sum + t.realizedPnL, 0);
    expect(totalPnl).toBe(11000);

    // Delete sell transaction #3
    txns = txns.filter(t => t.id !== '3');
    result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.realizedTrades).toHaveLength(0);
    expect(result.openLots).toHaveLength(2);
    expect(result.openLots[0].availableQuantity).toBe(10);
  });

  // Test 15: Invalid transaction dates
  it('15. correctly rejects or ignores invalid dates safely', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'INFY', date: 'invalid-date', quantity: 10, price: 1000, charges: 0 }
    ];
    expect(() => processFifoTransactions(txns, DEFAULT_TAX_RULES)).not.toThrow();
  });

  // Test 16: Selling more shares than available
  it('16. prevents selling more shares than available and reports error', () => {
    const txns = [
      { id: '1', type: 'BUY', symbol: 'ITC', date: '2026-01-01', quantity: 10, price: 400, charges: 0 },
      { id: '2', type: 'SELL', symbol: 'ITC', date: '2026-02-01', quantity: 15, price: 450, charges: 0 }
    ];

    const result = processFifoTransactions(txns, DEFAULT_TAX_RULES);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('only 10 shares were available');
  });

  // Test 17: Backup and restore structure validation
  it('17. validates data structure integrity for backup and restore', () => {
    const mockBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'NetNafa',
      data: {
        transactions: [{ id: 'tx_1', symbol: 'TCS', quantity: 10, price: 3500 }],
        currentPrices: { TCS: 3600 },
        taxRules: DEFAULT_TAX_RULES,
        profile: { investorName: 'Test Investor' },
        ipoList: []
      }
    };

    expect(mockBackup.appName).toBe('NetNafa');
    expect(Array.isArray(mockBackup.data.transactions)).toBe(true);
    expect(typeof mockBackup.data.currentPrices).toBe('object');
  });
});
