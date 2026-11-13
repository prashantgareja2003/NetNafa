/**
 * Realistic Indian Stock Market Demo Data for NetNafa.
 * Includes:
 * 1. Long-term holdings (TCS, Reliance)
 * 2. Multi-lot purchases & partial sales (HDFC Bank, Infosys)
 * 3. Gifted shares with donor holding details (Wipro)
 * 4. IPO Allotment & Listing (Tata Technologies, Zomato)
 * 5. Bonus & Split history (Tata Steel, Reliance)
 * 6. Short-term and long-term realized trades for realistic FY tax calculation.
 */

export const SAMPLE_PROFILE = {
  investorName: 'Aditya Sharma',
  panNumber: 'ABCPS1234F',
  dematProvider: 'Zerodha Kite',
  preferredExchange: 'NSE',
  defaultFy: '2026-27'
};

export const SAMPLE_TRANSACTIONS = [
  // 1. Reliance Industries - Long Term Investment with multi-lot buy & partial sell
  {
    id: 'tx_rel_1',
    type: 'BUY',
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    exchange: 'NSE',
    sector: 'Energy, Oil & Gas',
    date: '2024-05-10',
    quantity: 25,
    price: 2420.00,
    brokerage: 20.00,
    stt: 60.50,
    exchangeCharges: 8.50,
    gst: 5.13,
    stampDuty: 9.08,
    otherCharges: 0,
    charges: 103.21,
    notes: 'Initial long term position post Q4 earnings'
  },
  {
    id: 'tx_rel_2',
    type: 'BUY',
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    exchange: 'NSE',
    sector: 'Energy, Oil & Gas',
    date: '2024-11-15',
    quantity: 25,
    price: 2550.00,
    brokerage: 20.00,
    stt: 63.75,
    exchangeCharges: 8.90,
    gst: 5.20,
    stampDuty: 9.56,
    otherCharges: 0,
    charges: 107.41,
    notes: 'Dip addition during market correction'
  },
  {
    id: 'tx_rel_sell',
    type: 'SELL',
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    exchange: 'NSE',
    sector: 'Energy, Oil & Gas',
    date: '2026-06-20', // Sold after > 12 months -> LTCG in FY 2026-27
    quantity: 20,
    price: 2980.00,
    brokerage: 20.00,
    stt: 59.60,
    exchangeCharges: 8.34,
    gst: 5.10,
    stampDuty: 0,
    otherCharges: 0,
    charges: 93.04,
    notes: 'Partial profit booking on first lot (LTCG)'
  },

  // 2. Infosys - STCG Realized Trade
  {
    id: 'tx_infy_1',
    type: 'BUY',
    symbol: 'INFY',
    stockName: 'Infosys Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2026-04-12',
    quantity: 50,
    price: 1450.00,
    charges: 120.00,
    notes: 'Tech accumulation'
  },
  {
    id: 'tx_infy_sell',
    type: 'SELL',
    symbol: 'INFY',
    stockName: 'Infosys Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2026-08-18', // Held for ~4 months -> STCG in FY 2026-27
    quantity: 30,
    price: 1680.00,
    charges: 90.00,
    notes: 'Short term swing profit'
  },

  // 3. Tata Consultancy Services - Core Compounder
  {
    id: 'tx_tcs_1',
    type: 'BUY',
    symbol: 'TCS',
    stockName: 'Tata Consultancy Services Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2024-03-05',
    quantity: 30,
    price: 3620.00,
    charges: 180.00,
    notes: 'Long term portfolio bedrock'
  },

  // 4. HDFC Bank - Banking Titan
  {
    id: 'tx_hdfc_1',
    type: 'BUY',
    symbol: 'HDFCBANK',
    stockName: 'HDFC Bank Ltd',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    date: '2025-01-15',
    quantity: 60,
    price: 1540.00,
    charges: 155.00,
    notes: 'Post-merger value buy'
  },
  {
    id: 'tx_hdfc_2',
    type: 'BUY',
    symbol: 'HDFCBANK',
    stockName: 'HDFC Bank Ltd',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    date: '2025-08-10',
    quantity: 40,
    price: 1620.00,
    charges: 110.00,
    notes: 'Q1 results follow-up'
  },

  // 5. Wipro - Gifted Shares from Father
  {
    id: 'tx_wipro_gift',
    type: 'GIFT_RECEIVED',
    symbol: 'WIPRO',
    stockName: 'Wipro Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2025-10-01',
    donorPurchaseDate: '2022-03-15',
    donorPurchasePrice: 380.00,
    giftedBy: 'Father (Prakash Sharma)',
    quantity: 100,
    price: 380.00,
    charges: 50.00,
    notes: 'Family gift transferred under Section 47(iii). Holding period starts from donor date (2022).'
  },

  // 6. Tata Technologies - IPO Allotment
  {
    id: 'tx_tatatech_ipo',
    type: 'IPO_ALLOTMENT',
    symbol: 'TATATECH',
    stockName: 'Tata Technologies Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2023-11-30',
    quantity: 60,
    price: 500.00,
    charges: 0,
    notes: 'Retail IPO Allotment at cutoff ₹500'
  },
  {
    id: 'tx_tatatech_sell',
    type: 'SELL',
    symbol: 'TATATECH',
    stockName: 'Tata Technologies Ltd',
    exchange: 'NSE',
    sector: 'Information Technology',
    date: '2026-05-15', // Held > 12 months -> LTCG in FY 2026-27
    quantity: 30,
    price: 940.00,
    charges: 65.00,
    notes: 'Partial profit booking on listing bumper'
  },

  // 7. Tata Steel - Corporate Action: Split and Buy
  {
    id: 'tx_tatasteel_1',
    type: 'BUY',
    symbol: 'TATASTEEL',
    stockName: 'Tata Steel Ltd',
    exchange: 'NSE',
    sector: 'Metals & Mining',
    date: '2025-06-10',
    quantity: 100,
    price: 140.00,
    charges: 45.00,
    notes: 'Infrastructure and steel demand play'
  }
];

export const SAMPLE_CURRENT_PRICES = {
  RELIANCE: 3020.00,
  INFY: 1720.00,
  TCS: 3950.00,
  HDFCBANK: 1780.00,
  WIPRO: 490.00,
  TATATECH: 960.00,
  TATASTEEL: 155.00
};

export const SAMPLE_IPOS = [
  {
    id: 'ipo_tatatech',
    companyName: 'Tata Technologies Ltd',
    symbol: 'TATATECH',
    exchange: 'NSE',
    issuePrice: 500.00,
    applicationDate: '2023-11-22',
    allottedQuantity: 60,
    allotmentDate: '2023-11-28',
    listingDate: '2023-11-30',
    listingPrice: 1200.00,
    currentPrice: 960.00,
    saleDate: '2026-05-15',
    saleQuantity: 30,
    salePrice: 940.00,
    charges: 65.00,
    status: 'PARTIALLY_SOLD',
    notes: 'Oversubscribed 69x. Listed at 140% premium.'
  },
  {
    id: 'ipo_zomato',
    companyName: 'Zomato Ltd (Eternal)',
    symbol: 'ZOMATO',
    exchange: 'NSE',
    issuePrice: 76.00,
    applicationDate: '2021-07-14',
    allottedQuantity: 195,
    allotmentDate: '2021-07-22',
    listingDate: '2021-07-23',
    listingPrice: 115.00,
    currentPrice: 240.00,
    saleDate: '2021-07-23',
    saleQuantity: 195,
    salePrice: 126.00,
    charges: 75.00,
    status: 'FULLY_SOLD',
    notes: 'Flipped on listing day for 65% quick gain.'
  },
  {
    id: 'ipo_swiggy',
    companyName: 'Swiggy Ltd',
    symbol: 'SWIGGY',
    exchange: 'NSE',
    issuePrice: 390.00,
    applicationDate: '2024-11-06',
    allottedQuantity: 38,
    allotmentDate: '2024-11-11',
    listingDate: '2024-11-13',
    listingPrice: 420.00,
    currentPrice: 460.00,
    saleDate: null,
    saleQuantity: 0,
    salePrice: 0,
    charges: 0,
    status: 'HOLDING',
    notes: 'Quick commerce expansion play. Holding for long term.'
  }
];
