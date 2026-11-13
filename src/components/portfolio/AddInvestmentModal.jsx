import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { SECTORS, INVESTMENT_TYPES } from '../../utils/constants/taxRules';
import { safeNumber, addMoney, multiplyMoney, divideMoney, roundCurrency } from '../../services/calculations/decimalUtils';
import { formatINR } from '../../utils/formatters/formatters';

export const AddInvestmentModal = ({ isOpen, onClose, onAddTransaction }) => {
  const [stockName, setStockName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [sector, setSector] = useState(SECTORS[0]);
  const [investmentType, setInvestmentType] = useState('EQUITY');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Charges
  const [brokerage, setBrokerage] = useState('');
  const [stt, setStt] = useState('');
  const [exchangeCharges, setExchangeCharges] = useState('');
  const [gst, setGst] = useState('');
  const [stampDuty, setStampDuty] = useState('');
  const [otherCharges, setOtherCharges] = useState('');

  // Gifted specific
  const [giftedBy, setGiftedBy] = useState('');
  const [donorPurchaseDate, setDonorPurchaseDate] = useState('');
  const [donorPurchasePrice, setDonorPurchasePrice] = useState('');

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Auto Calculations
  const qtyNum = safeNumber(quantity);
  const priceNum = safeNumber(price);
  const grossValue = multiplyMoney(qtyNum, priceNum);

  const totalCharges = addMoney(
    addMoney(
      addMoney(safeNumber(brokerage), safeNumber(stt)),
      addMoney(safeNumber(exchangeCharges), safeNumber(gst))
    ),
    addMoney(safeNumber(stampDuty), safeNumber(otherCharges))
  );

  const totalAcquisitionCost = addMoney(grossValue, totalCharges);
  const avgCostPerShare = qtyNum > 0 ? divideMoney(totalAcquisitionCost, qtyNum) : 0;

  const validate = () => {
    const errs = {};
    if (!stockName.trim()) errs.stockName = 'Stock or company name is required';
    if (!symbol.trim()) errs.symbol = 'Stock symbol / ticker is required';
    if (!date) errs.date = 'Acquisition date is required';
    if (qtyNum <= 0) errs.quantity = 'Quantity must be greater than 0';

    if (investmentType !== 'BONUS' && priceNum <= 0) {
      errs.price = 'Purchase price must be greater than 0';
    }

    if (investmentType === 'GIFTED') {
      if (!giftedBy.trim()) errs.giftedBy = 'Donor name is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let txnType = 'BUY';
    if (investmentType === 'IPO') txnType = 'IPO_ALLOTMENT';
    else if (investmentType === 'BONUS') txnType = 'BONUS';
    else if (investmentType === 'GIFTED') txnType = 'GIFT_RECEIVED';

    onAddTransaction({
      stockName: stockName.trim(),
      symbol: symbol.toUpperCase().trim(),
      exchange,
      sector,
      type: txnType,
      date,
      quantity: qtyNum,
      price: investmentType === 'BONUS' ? 0 : priceNum,
      brokerage: safeNumber(brokerage),
      stt: safeNumber(stt),
      exchangeCharges: safeNumber(exchangeCharges),
      gst: safeNumber(gst),
      stampDuty: safeNumber(stampDuty),
      otherCharges: safeNumber(otherCharges),
      charges: totalCharges,
      // Gift fields
      giftedBy: investmentType === 'GIFTED' ? giftedBy.trim() : null,
      donorPurchaseDate: investmentType === 'GIFTED' ? donorPurchaseDate || null : null,
      donorPurchasePrice: investmentType === 'GIFTED' ? safeNumber(donorPurchasePrice || priceNum) : null,
      notes: notes.trim()
    });

    handleClose();
  };

  const handleClose = () => {
    setStockName('');
    setSymbol('');
    setQuantity('');
    setPrice('');
    setBrokerage('');
    setStt('');
    setExchangeCharges('');
    setGst('');
    setStampDuty('');
    setOtherCharges('');
    setGiftedBy('');
    setDonorPurchaseDate('');
    setDonorPurchasePrice('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Investment / Purchase Lot"
      subtitle="Record an equity acquisition, IPO allotment, bonus issue, or gifted shares."
      maxWidth="700px"
    >
      <form onSubmit={handleSubmit}>
        {/* Row 1: Stock Details */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              Company / Stock Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Reliance Industries Ltd"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
            />
            {errors.stockName && <span className="form-error">{errors.stockName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Stock Symbol <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. RELIANCE"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            {errors.symbol && <span className="form-error">{errors.symbol}</span>}
          </div>
        </div>

        {/* Row 2: Exchange, Sector, Investment Type */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Exchange</label>
            <select
              className="form-control"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
            >
              <option value="NSE">NSE (National Stock Exchange)</option>
              <option value="BSE">BSE (Bombay Stock Exchange)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sector</label>
            <select
              className="form-control"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Investment Type</label>
            <select
              className="form-control"
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
            >
              {INVESTMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Date, Quantity, Price */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">
              Purchase Date <span className="required">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Quantity (Shares) <span className="required">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="1"
              className="form-control"
              placeholder="e.g. 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && <span className="form-error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Price Per Share (₹) {investmentType !== 'BONUS' && <span className="required">*</span>}
            </label>
            <input
              type="number"
              step="any"
              min="0"
              className="form-control"
              placeholder={investmentType === 'BONUS' ? '0.00 (Bonus free)' : 'e.g. 2450.00'}
              value={investmentType === 'BONUS' ? '0' : price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={investmentType === 'BONUS'}
            />
            {errors.price && <span className="form-error">{errors.price}</span>}
          </div>
        </div>

        {/* Gifted Shares Specific Section */}
        {investmentType === 'GIFTED' && (
          <div style={{ backgroundColor: '#EDF4FE', padding: '14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #D0E1FD' }}>
            <h4 style={{ color: '#0B2545', marginBottom: '10px' }}>Gifted / Inherited Shares Details (Section 49(1))</h4>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Gifted By / Donor <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Father / Mother"
                  value={giftedBy}
                  onChange={(e) => setGiftedBy(e.target.value)}
                />
                {errors.giftedBy && <span className="form-error">{errors.giftedBy}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Donor Purchase Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={donorPurchaseDate}
                  onChange={(e) => setDonorPurchaseDate(e.target.value)}
                />
                <span className="form-hint">Used for holding period eligibility</span>
              </div>

              <div className="form-group">
                <label className="form-label">Donor Purchase Price (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="Cost to previous owner"
                  value={donorPurchasePrice}
                  onChange={(e) => setDonorPurchasePrice(e.target.value)}
                />
                <span className="form-hint">Cost of acquisition</span>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Charges Breakdown */}
        <details style={{ marginBottom: '16px', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#0056D2', fontSize: '13px' }}>
            + Additional Acquisition Charges (Brokerage, STT, GST, Stamp Duty)
          </summary>
          <div className="grid-3" style={{ marginTop: '14px' }}>
            <div className="form-group">
              <label className="form-label">Brokerage (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={brokerage} onChange={(e) => setBrokerage(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">STT (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={stt} onChange={(e) => setStt(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Exchange Charges (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={exchangeCharges} onChange={(e) => setExchangeCharges(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GST (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={gst} onChange={(e) => setGst(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Stamp Duty (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={stampDuty} onChange={(e) => setStampDuty(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Other Charges (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={otherCharges} onChange={(e) => setOtherCharges(e.target.value)} />
            </div>
          </div>
        </details>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Investment Notes / Demat Order ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Optional order reference or thesis"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Live Calculation Summary Banner */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Gross Purchase</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>{formatINR(grossValue)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Charges</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#64748B' }}>{formatINR(totalCharges)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Cost</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0B2545' }}>{formatINR(totalAcquisitionCost)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Cost / Share</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>{formatINR(avgCostPerShare)}</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: '1 1 100px' }} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
            Save Investment
          </button>
        </div>
      </form>
    </Modal>
  );
};
