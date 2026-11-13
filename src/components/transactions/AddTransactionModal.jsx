import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { TRANSACTION_TYPES, SECTORS } from '../../utils/constants/taxRules';
import { safeNumber, addMoney, multiplyMoney, subtractMoney } from '../../services/calculations/decimalUtils';
import { formatINR } from '../../utils/formatters/formatters';

export const AddTransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const { portfolio, addTransaction, updateTransaction } = useApp();

  const [type, setType] = useState('BUY');
  const [stockName, setStockName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [sector, setSector] = useState(SECTORS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [charges, setCharges] = useState('');
  const [splitRatio, setSplitRatio] = useState('2');

  // Gift details
  const [giftedBy, setGiftedBy] = useState('');
  const [donorPurchaseDate, setDonorPurchaseDate] = useState('');
  const [donorPurchasePrice, setDonorPurchasePrice] = useState('');

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'BUY');
      setStockName(initialData.stockName || '');
      setSymbol(initialData.symbol || '');
      setExchange(initialData.exchange || 'NSE');
      setSector(initialData.sector || SECTORS[0]);
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setQuantity(String(initialData.quantity || ''));
      setPrice(String(initialData.price || ''));
      setCharges(String(initialData.charges || ''));
      setSplitRatio(String(initialData.splitRatio || '2'));
      setGiftedBy(initialData.giftedBy || '');
      setDonorPurchaseDate(initialData.donorPurchaseDate || '');
      setDonorPurchasePrice(String(initialData.donorPurchasePrice || ''));
      setNotes(initialData.notes || '');
      setErrors({});
    } else {
      setType('BUY');
      setStockName('');
      setSymbol('');
      setExchange('NSE');
      setSector(SECTORS[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setQuantity('');
      setPrice('');
      setCharges('');
      setSplitRatio('2');
      setGiftedBy('');
      setDonorPurchaseDate('');
      setDonorPurchasePrice('');
      setNotes('');
      setErrors({});
    }
  }, [initialData, isOpen]);

  // When stock symbol is selected in SELL or from portfolio
  const handleSelectExistingStock = (sym) => {
    const existing = portfolio.find(p => p.symbol === sym);
    if (existing) {
      setSymbol(existing.symbol);
      setStockName(existing.stockName);
      setExchange(existing.exchange || 'NSE');
      setSector(existing.sector || SECTORS[0]);
      if (existing.currentPrice) {
        setPrice(String(existing.currentPrice));
      }
    }
  };

  const selectedStockHolding = portfolio.find(p => p.symbol === symbol.toUpperCase().trim());
  const maxAvailableQty = selectedStockHolding ? selectedStockHolding.totalQuantity : 0;

  const qtyNum = safeNumber(quantity);
  const priceNum = safeNumber(price);
  const chargesNum = safeNumber(charges);
  const grossVal = multiplyMoney(qtyNum, priceNum);
  const netVal = type === 'SELL' ? subtractMoney(grossVal, chargesNum) : addMoney(grossVal, chargesNum);

  const validate = () => {
    const errs = {};
    if (!symbol.trim()) errs.symbol = 'Stock symbol is required';
    if (!date) errs.date = 'Transaction date is required';
    if (qtyNum <= 0 && type !== 'SPLIT') errs.quantity = 'Quantity must be greater than 0';

    if (type === 'SELL') {
      if (!initialData && qtyNum > maxAvailableQty) {
        errs.quantity = `Cannot sell ${qtyNum} shares. Only ${maxAvailableQty} shares available in portfolio.`;
      }
      if (priceNum <= 0) errs.price = 'Selling price must be greater than 0';
    }

    if (type === 'BUY' || type === 'IPO_ALLOTMENT') {
      if (priceNum <= 0) errs.price = 'Price must be greater than 0';
    }

    if (type === 'SPLIT' && safeNumber(splitRatio) < 2) {
      errs.splitRatio = 'Split ratio must be at least 2 (e.g. 1:2 split)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const txnPayload = {
      type,
      stockName: stockName.trim() || symbol.toUpperCase().trim(),
      symbol: symbol.toUpperCase().trim(),
      exchange,
      sector,
      date,
      quantity: type === 'SPLIT' ? 0 : qtyNum,
      price: type === 'BONUS' ? 0 : priceNum,
      charges: chargesNum,
      splitRatio: type === 'SPLIT' ? safeNumber(splitRatio, 2) : undefined,
      giftedBy: type === 'GIFT_RECEIVED' ? giftedBy.trim() : undefined,
      donorPurchaseDate: type === 'GIFT_RECEIVED' ? donorPurchaseDate || null : undefined,
      donorPurchasePrice: type === 'GIFT_RECEIVED' ? safeNumber(donorPurchasePrice || priceNum) : undefined,
      notes: notes.trim()
    };

    if (initialData && initialData.id) {
      updateTransaction(initialData.id, txnPayload);
    } else {
      addTransaction(txnPayload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      subtitle="Maintains FIFO accounting lots and Indian capital gains taxation ledger."
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        {/* Transaction Type Selector */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {Object.keys(TRANSACTION_TYPES).map((tKey) => {
              const isSelected = type === tKey;
              return (
                <button
                  type="button"
                  key={tKey}
                  onClick={() => setType(tKey)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? '#0056D2' : '#F8FAFC',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    border: isSelected ? '1px solid #0056D2' : '1px solid #E2E8F0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tKey.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Symbol & Selection */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              Select or Enter Stock Symbol <span className="required">*</span>
            </label>
            {portfolio.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. TCS"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
                <select
                  className="form-control"
                  style={{ width: '130px', flexShrink: 0 }}
                  value=""
                  onChange={(e) => handleSelectExistingStock(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {portfolio.map((p) => (
                    <option key={p.symbol} value={p.symbol}>
                      {p.symbol} ({p.totalQuantity} sh)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="e.g. TCS"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              />
            )}
            {errors.symbol && <span className="form-error">{errors.symbol}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Company / Stock Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Tata Consultancy Services"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
            />
          </div>
        </div>

        {/* Sell Available Stock Info Banner */}
        {type === 'SELL' && selectedStockHolding && (
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '12.5px', color: '#92400E' }}>
            <strong>Available to Sell:</strong> {selectedStockHolding.totalQuantity} shares of {symbol} (Avg Cost: {formatINR(selectedStockHolding.avgBuyPrice)})
          </div>
        )}

        {/* Date, Quantity, Price */}
        {type !== 'SPLIT' ? (
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">
                Date <span className="required">*</span>
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
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="1"
                className="form-control"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Price Per Share (₹) {type !== 'BONUS' && <span className="required">*</span>}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                className="form-control"
                placeholder={type === 'BONUS' ? '0.00' : 'e.g. 1500.00'}
                value={type === 'BONUS' ? '0' : price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={type === 'BONUS'}
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
          </div>
        ) : (
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Split Effective Date <span className="required">*</span></label>
              <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Split Multiplier Ratio <span className="required">*</span></label>
              <input
                type="number"
                min="2"
                className="form-control"
                placeholder="e.g. 2 for 1:2 split, 10 for 1:10"
                value={splitRatio}
                onChange={(e) => setSplitRatio(e.target.value)}
              />
              {errors.splitRatio && <span className="form-error">{errors.splitRatio}</span>}
            </div>
          </div>
        )}

        {/* Charges and Notes */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Total Applicable Charges (₹)</label>
            <input
              type="number"
              step="any"
              min="0"
              className="form-control"
              placeholder="Brokerage, STT, GST, etc."
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Notes / Reference</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Profit booking, Demat ref"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Calculation Banner */}
        {type !== 'SPLIT' && (
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
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Gross Value</span>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>{formatINR(grossVal)}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Charges</span>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#64748B' }}>{formatINR(chargesNum)}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                {type === 'SELL' ? 'Net Consideration' : 'Total Net Cost'}
              </span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0056D2' }}>{formatINR(netVal)}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: '1 1 100px' }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
            {initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
