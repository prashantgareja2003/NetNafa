import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AVAILABLE_FINANCIAL_YEARS } from '../../utils/constants/taxRules';
import {
  Settings as SettingsIcon,
  User,
  Database,
  Download,
  Upload,
  Trash2,
  Sparkles,
  ShieldAlert,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const Settings = () => {
  const {
    profile,
    updateProfile,
    selectedFy,
    setSelectedFy,
    loadDemoData,
    clearAllData,
    exportBackup,
    importBackup,
    transactions,
    ipos
  } = useApp();

  const [name, setName] = useState(profile?.investorName || '');
  const [pan, setPan] = useState(profile?.panNumber || '');
  const [broker, setBroker] = useState(profile?.dematProvider || '');
  const [exchange, setExchange] = useState(profile?.preferredExchange || 'NSE');

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      investorName: name.trim(),
      panNumber: pan.toUpperCase().trim(),
      dematProvider: broker.trim(),
      preferredExchange: exchange,
      defaultFy: selectedFy
    });
  };

  const handleExport = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NetNafa_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Settings & Data Management</h1>
        <p style={{ color: '#64748B', fontSize: '13.5px' }}>
          Manage your local investor profile, active financial year preferences, and secure JSON data backups.
        </p>
      </div>

      {/* 1. Investor Profile */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <User size={18} color="#0056D2" />
            Investor Profile (Stored Locally in Browser)
          </span>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Investor Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aditya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PAN Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
              />
              <span className="form-hint">Used solely for statement titles. Strictly client-side.</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Demat Broker / Depository Participant</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Zerodha, Groww, Angel One"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Exchange</label>
              <select
                className="form-control"
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
              >
                <option value="NSE">NSE (National Stock Exchange of India)</option>
                <option value="BSE">BSE (Bombay Stock Exchange)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <CheckCircle2 size={14} />
              <span>Save Profile Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. System & Financial Year Preferences */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <SettingsIcon size={18} color="#0056D2" />
            Financial Year & Currency System
          </span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Active Assessment Financial Year</label>
            <select
              className="form-control"
              value={selectedFy}
              onChange={(e) => setSelectedFy(e.target.value)}
            >
              {AVAILABLE_FINANCIAL_YEARS.map(fy => (
                <option key={fy} value={fy}>Financial Year {fy}</option>
              ))}
            </select>
            <span className="form-hint">Controls the active assessment year for the Tax Center and Reports.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Base Currency Standard</label>
            <input
              type="text"
              className="form-control"
              value="INR (₹) - Indian Rupee (Lakhs & Crores)"
              disabled
            />
            <span className="form-hint">Complies with Reserve Bank of India & Income Tax reporting.</span>
          </div>
        </div>
      </div>

      {/* 3. Data Backup and Restore */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <Database size={18} color="#0056D2" />
            JSON Backup & Restore (Local Storage Migration)
          </span>
          <span className="badge badge-gold">Schema v1.0.0</span>
        </div>

        <p style={{ fontSize: '13px', color: '#777078', marginBottom: '20px', lineHeight: 1.5 }}>
          Export all your transactions, prices, IPO tracking records, and customized tax rules into a secure, portable JSON backup file. You can restore this file at any time on any device.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={handleExport}>
            <Download size={16} />
            <span>Download Full JSON Backup</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            <span>Restore from Backup File</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#777078', display: 'flex', gap: '16px' }}>
          <span>Current Ledger: <strong>{transactions.length}</strong> transactions</span>
          <span>Tracked IPOs: <strong>{ipos.length}</strong> IPOs</span>
        </div>
      </div>

      {/* 4. Demo Data & Reset */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <Sparkles size={18} color="#C8961E" />
            Sample Indian Investment Dataset
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Explore NetNafa with realistic Indian equities (Reliance, TCS, HDFC Bank, Infosys), Tata Tech IPO, gifted Wipro shares, and realistic FY 2026-27 STCG/LTCG capital gains.
        </p>

        <button
          type="button"
          className="btn btn-gold"
          onClick={() => setIsDemoConfirmOpen(true)}
        >
          <Sparkles size={16} />
          <span>Load Realistic Indian Portfolio Dataset</span>
        </button>
      </div>

      {/* 5. Danger Zone */}
      <div className="card" style={{ borderColor: '#F8C3C6', backgroundColor: '#FFFFFF' }}>
        <div className="card-header" style={{ borderBottomColor: '#F8C3C6' }}>
          <span className="card-title" style={{ color: '#D94A52' }}>
            <Trash2 size={18} />
            Danger Zone: Reset Application Data
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#777078', marginBottom: '16px' }}>
          Permanently delete all transaction ledgers, portfolio holdings, current prices, and tracked IPOs from this browser's LocalStorage. This action cannot be undone.
        </p>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setIsClearConfirmOpen(true)}
        >
          <Trash2 size={15} />
          <span>Clear All Portfolio & Tax Records</span>
        </button>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isDemoConfirmOpen}
        onClose={() => setIsDemoConfirmOpen(false)}
        onConfirm={loadDemoData}
        title="Load Sample Indian Portfolio"
        message="This will overwrite current local transactions with realistic Indian market demo records (Tata Tech IPO, Reliance multi-lots, gifted shares). Do you wish to continue?"
        confirmText="Load Dataset"
      />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Permanently Clear All Data"
        message="Are you sure you want to wipe all transactions, lots, and IPO records? Please ensure you have downloaded a JSON backup if you wish to retain your records."
        confirmText="Permanently Erase"
        isDangerous={true}
      />
    </div>
  );
};
