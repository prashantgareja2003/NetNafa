import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { safeNumber, addMoney, multiplyMoney, subtractMoney, roundCurrency } from '../../services/calculations/decimalUtils';
import { formatINR } from '../../utils/formatters/formatters';

export const AddIpoModal = ({ isOpen, onClose, initialData = null, onSaveIpo }) => {
  const [companyName, setCompanyName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [issuePrice, setIssuePrice] = useState('');
  const [applicationDate, setApplicationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [allottedQuantity, setAllottedQuantity] = useState('');
  const [allotmentDate, setAllotmentDate] = useState('');
  const [listingDate, setListingDate] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  // Sale fields if partially or fully exited
  const [saleDate, setSaleDate] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [charges, setCharges] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setSymbol(initialData.symbol || '');
      setExchange(initialData.exchange || 'NSE');
      setIssuePrice(String(initialData.issuePrice || ''));
      setApplicationDate(initialData.applicationDate || '');
      setAllottedQuantity(String(initialData.allottedQuantity || ''));
      setAllotmentDate(initialData.allotmentDate || '');
      setListingDate(initialData.listingDate || '');
      setListingPrice(String(initialData.listingPrice || ''));
      setCurrentPrice(String(initialData.currentPrice || ''));
      setSaleDate(initialData.saleDate || '');
      setSaleQuantity(String(initialData.saleQuantity || ''));
      setSalePrice(String(initialData.salePrice || ''));
      setCharges(String(initialData.charges || ''));
      setNotes(initialData.notes || '');
      setErrors({});
    } else {
      setCompanyName('');
      setSymbol('');
      setExchange('NSE');
      setIssuePrice('');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setAllottedQuantity('');
      setAllotmentDate('');
      setListingDate('');
      setListingPrice('');
      setCurrentPrice('');
      setSaleDate('');
      setSaleQuantity('');
      setSalePrice('');
      setCharges('');
      setNotes('');
      setErrors({});
    }
  }, [initialData, isOpen]);

  const issuePriceNum = safeNumber(issuePrice);
  const allottedQtyNum = safeNumber(allottedQuantity);
  const totalInvestment = multiplyMoney(issuePriceNum, allottedQtyNum);
  const listingPriceNum = safeNumber(listingPrice);
  const listingGain = listingPriceNum > 0 ? multiplyMoney(allottedQtyNum, subtractMoney(listingPriceNum, issuePriceNum)) : 0;

  const validate = () => {
    const errs = {};
    if (!companyName.trim()) errs.companyName = 'Company name is required';
    if (!symbol.trim()) errs.symbol = 'Stock ticker/symbol is required';
    if (issuePriceNum <= 0) errs.issuePrice = 'Issue price must be greater than 0';
    if (allottedQtyNum < 0) errs.allottedQuantity = 'Allotted quantity cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSaveIpo({
      id: initialData ? initialData.id : undefined,
      companyName: companyName.trim(),
      symbol: symbol.toUpperCase().trim(),
      exchange,
      issuePrice: issuePriceNum,
      applicationDate,
      allottedQuantity: allottedQtyNum,
      allotmentDate: allotmentDate || null,
      listingDate: listingDate || null,
      listingPrice: listingPriceNum,
      currentPrice: safeNumber(currentPrice, listingPriceNum || issuePriceNum),
      saleDate: saleDate || null,
      saleQuantity: safeNumber(saleQuantity),
      salePrice: safeNumber(salePrice),
      charges: safeNumber(charges),
      status: safeNumber(saleQuantity) >= allottedQtyNum && allottedQtyNum > 0
        ? 'FULLY_SOLD'
        : safeNumber(saleQuantity) > 0
        ? 'PARTIALLY_SOLD'
        : 'HOLDING',
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit IPO Investment' : 'Track New IPO Investment'}
      subtitle="Track allotment, listing gains, and seamless capital gains integration."
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        {/* Row 1: Company & Symbol */}
        <div className="grid-3">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Company Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Tata Technologies Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            {errors.companyName && <span className="form-error">{errors.companyName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Ticker / Symbol <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. TATATECH"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            {errors.symbol && <span className="form-error">{errors.symbol}</span>}
          </div>
        </div>

        {/* Row 2: Issue Price, Allotted Qty, Application Date */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Issue / Cutoff Price (₹) <span className="required">*</span></label>
            <input
              type="number"
              step="any"
              min="1"
              className="form-control"
              placeholder="e.g. 500.00"
              value={issuePrice}
              onChange={(e) => setIssuePrice(e.target.value)}
            />
            {errors.issuePrice && <span className="form-error">{errors.issuePrice}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Allotted Quantity (Shares)</label>
            <input
              type="number"
              step="any"
              min="0"
              className="form-control"
              placeholder="e.g. 60 (0 if not allotted)"
              value={allottedQuantity}
              onChange={(e) => setAllottedQuantity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Application Date</label>
            <input
              type="date"
              className="form-control"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Allotment Date, Listing Date, Listing Price */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Allotment Date</label>
            <input
              type="date"
              className="form-control"
              value={allotmentDate}
              onChange={(e) => setAllotmentDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Listing Date</label>
            <input
              type="date"
              className="form-control"
              value={listingDate}
              onChange={(e) => setListingDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Listing Day Open / Price (₹)</label>
            <input
              type="number"
              step="any"
              min="0"
              className="form-control"
              placeholder="e.g. 1200.00"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sale / Exit Section */}
        <details style={{ marginBottom: '16px', border: '1px solid #EAE5E4', borderRadius: '6px', padding: '10px 14px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#76243A', fontSize: '13px' }}>
            + IPO Sale / Exit Details (If partially or fully exited)
          </summary>
          <div className="grid-3" style={{ marginTop: '14px' }}>
            <div className="form-group">
              <label className="form-label">Sale Date</label>
              <input type="date" className="form-control" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sold Quantity</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0" value={saleQuantity} onChange={(e) => setSaleQuantity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Selling Price Per Share (₹)</label>
              <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Selling Charges (STT, Brokerage ₹)</label>
            <input type="number" step="any" min="0" className="form-control" placeholder="0.00" value={charges} onChange={(e) => setCharges(e.target.value)} />
          </div>
        </details>

        {/* Summary Card */}
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
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Invested</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{formatINR(totalInvestment)}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Listing Gain</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: listingGain >= 0 ? '#059669' : '#DC2626' }}>
              {listingGain >= 0 ? '+' : ''}{formatINR(listingGain)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Lot Ledger</span>
            <div style={{ fontSize: '12.5px', color: '#0056D2', fontWeight: 700 }}>Auto FIFO Sync</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: '1 1 100px' }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
            Save IPO
          </button>
        </div>
      </form>
    </Modal>
  );
};
