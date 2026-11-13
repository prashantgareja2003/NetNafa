import { DEFAULT_TAX_RULES } from '../../utils/constants/taxRules';
import { SAMPLE_TRANSACTIONS, SAMPLE_CURRENT_PRICES, SAMPLE_IPOS, SAMPLE_PROFILE } from './initialData';

const SCHEMA_VERSION = '1.0.0';

const STORAGE_KEYS = {
  VERSION: 'netnafa_schema_version',
  TRANSACTIONS: 'netnafa_transactions',
  CURRENT_PRICES: 'netnafa_current_prices',
  TAX_RULES: 'netnafa_tax_rules',
  IPOS: 'netnafa_ipos',
  PROFILE: 'netnafa_profile',
  SELECTED_FY: 'netnafa_selected_fy'
};

export const StorageService = {
  // Check if storage is initialized
  init() {
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (!storedVersion) {
        localStorage.setItem(STORAGE_KEYS.VERSION, SCHEMA_VERSION);
        // Default tax rules
        if (!localStorage.getItem(STORAGE_KEYS.TAX_RULES)) {
          localStorage.setItem(STORAGE_KEYS.TAX_RULES, JSON.stringify(DEFAULT_TAX_RULES));
        }
        // Default selected FY
        if (!localStorage.getItem(STORAGE_KEYS.SELECTED_FY)) {
          localStorage.setItem(STORAGE_KEYS.SELECTED_FY, JSON.stringify('2026-27'));
        }
      }
    } catch (err) {
      console.error('LocalStorage init error:', err);
    }
  },

  // Transactions
  getTransactions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Error reading transactions from localStorage:', e);
      return [];
    }
  },

  saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      return true;
    } catch (e) {
      console.error('Error saving transactions to localStorage:', e);
      return false;
    }
  },

  // Current Prices
  getCurrentPrices() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Error reading current prices:', e);
      return {};
    }
  },

  saveCurrentPrices(prices) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(prices));
      return true;
    } catch (e) {
      console.error('Error saving prices:', e);
      return false;
    }
  },

  // Tax Rules
  getTaxRules() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TAX_RULES);
      return raw ? JSON.parse(raw) : DEFAULT_TAX_RULES;
    } catch (e) {
      return DEFAULT_TAX_RULES;
    }
  },

  saveTaxRules(rules) {
    try {
      localStorage.setItem(STORAGE_KEYS.TAX_RULES, JSON.stringify(rules));
      return true;
    } catch (e) {
      return false;
    }
  },

  // IPOs
  getIpos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.IPOS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveIpos(ipos) {
    try {
      localStorage.setItem(STORAGE_KEYS.IPOS, JSON.stringify(ipos));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Profile
  getProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return raw ? JSON.parse(raw) : { investorName: 'Investor', panNumber: '', dematProvider: '', defaultFy: '2026-27' };
    } catch (e) {
      return { investorName: 'Investor' };
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Selected FY
  getSelectedFy() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_FY);
      return raw ? JSON.parse(raw) : '2026-27';
    } catch (e) {
      return '2026-27';
    }
  },

  saveSelectedFy(fy) {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_FY, JSON.stringify(fy));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Load sample demo data
  loadDemoData() {
    this.saveTransactions(SAMPLE_TRANSACTIONS);
    this.saveCurrentPrices(SAMPLE_CURRENT_PRICES);
    this.saveIpos(SAMPLE_IPOS);
    this.saveProfile(SAMPLE_PROFILE);
    this.saveTaxRules(DEFAULT_TAX_RULES);
    this.saveSelectedFy('2026-27');
    return true;
  },

  // Clear all data
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PRICES);
      localStorage.removeItem(STORAGE_KEYS.IPOS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.setItem(STORAGE_KEYS.TAX_RULES, JSON.stringify(DEFAULT_TAX_RULES));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Export full JSON Backup
  exportBackup() {
    const backupData = {
      app: 'NetNafa',
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        transactions: this.getTransactions(),
        currentPrices: this.getCurrentPrices(),
        taxRules: this.getTaxRules(),
        ipos: this.getIpos(),
        profile: this.getProfile(),
        selectedFy: this.getSelectedFy()
      }
    };
    return JSON.stringify(backupData, null, 2);
  },

  // Import and Validate JSON Backup
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format.' };
      }

      if (parsed.app !== 'NetNafa' && !parsed.data) {
        return { success: false, error: 'Unrecognized backup file. Missing NetNafa signature.' };
      }

      const backupData = parsed.data || parsed;
      if (!Array.isArray(backupData.transactions)) {
        return { success: false, error: 'Backup does not contain a valid transactions ledger.' };
      }

      // Safe restore
      this.saveTransactions(backupData.transactions || []);
      this.saveCurrentPrices(backupData.currentPrices || {});
      this.saveTaxRules(backupData.taxRules || DEFAULT_TAX_RULES);
      this.saveIpos(backupData.ipos || []);
      if (backupData.profile) this.saveProfile(backupData.profile);
      if (backupData.selectedFy) this.saveSelectedFy(backupData.selectedFy);

      return {
        success: true,
        restoredCount: {
          transactions: (backupData.transactions || []).length,
          ipos: (backupData.ipos || []).length
        }
      };
    } catch (err) {
      return { success: false, error: 'Failed to parse backup JSON: ' + err.message };
    }
  }
};
