import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { safeNumber } from '../../services/calculations/decimalUtils';

export const TaxRuleConfigModal = ({ isOpen, onClose, targetFy }) => {
  const { taxRules, updateTaxRule } = useApp();
  const currentRule = taxRules[targetFy] || {};

  const [stcgRate, setStcgRate] = useState('20.0');
  const [ltcgRate, setLtcgRate] = useState('12.5');
  const [ltcgExemptionLimit, setLtcgExemptionLimit] = useState('125000');
  const [cessRate, setCessRate] = useState('4.0');
  const [surchargeRate, setSurchargeRate] = useState('0.0');
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState('12');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentRule) {
      setStcgRate(String(currentRule.stcgRate ?? 20.0));
      setLtcgRate(String(currentRule.ltcgRate ?? 12.5));
      setLtcgExemptionLimit(String(currentRule.ltcgExemptionLimit ?? 125000));
      setCessRate(String(currentRule.cessRate ?? 4.0));
      setSurchargeRate(String(currentRule.surchargeRate ?? 0.0));
      setHoldingPeriodMonths(String(currentRule.holdingPeriodMonthsEquity ?? 12));
      setNotes(currentRule.notes || '');
    }
  }, [currentRule, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTaxRule(targetFy, {
      ...currentRule,
      financialYear: targetFy,
      stcgRate: safeNumber(stcgRate, 20.0),
      ltcgRate: safeNumber(ltcgRate, 12.5),
      ltcgExemptionLimit: safeNumber(ltcgExemptionLimit, 125000),
      cessRate: safeNumber(cessRate, 4.0),
      surchargeRate: safeNumber(surchargeRate, 0.0),
      holdingPeriodMonthsEquity: safeNumber(holdingPeriodMonths, 12),
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Tax Rules (FY ${targetFy})`}
      subtitle="Customize applicable Indian equity taxation parameters, rates, and exemptions."
      maxWidth="550px"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">STCG Tax Rate (% Sec 111A)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="form-control"
              value={stcgRate}
              onChange={(e) => setStcgRate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">LTCG Tax Rate (% Sec 112A)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="form-control"
              value={ltcgRate}
              onChange={(e) => setLtcgRate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">LTCG Exemption Limit (₹)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="form-control"
              value={ltcgExemptionLimit}
              onChange={(e) => setLtcgExemptionLimit(e.target.value)}
            />
            <span className="form-hint">Union Budget threshold (e.g. ₹1,25,000)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Holding Period for LTCG (Months)</label>
            <input
              type="number"
              min="1"
              max="60"
              className="form-control"
              value={holdingPeriodMonths}
              onChange={(e) => setHoldingPeriodMonths(e.target.value)}
            />
            <span className="form-hint">Listed equity shares = 12 months</span>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Health & Education Cess (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              className="form-control"
              value={cessRate}
              onChange={(e) => setCessRate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Custom Surcharge Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              className="form-control"
              value={surchargeRate}
              onChange={(e) => setSurchargeRate(e.target.value)}
            />
            <span className="form-hint">0 = Auto-slab computation</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Statutory Rule Notes</label>
          <input
            type="text"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Statutory provision or amendment details"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Tax Configuration
          </button>
        </div>
      </form>
    </Modal>
  );
};
