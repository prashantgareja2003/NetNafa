import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useApp } from '../../context/AppContext';
import {
  DashboardColorIcon,
  PortfolioColorIcon,
  LivePricesColorIcon,
  TransactionsColorIcon,
  TaxCenterColorIcon,
  TaxRuleBookColorIcon,
  IpoTrackerColorIcon,
  ReportsColorIcon,
  SettingsColorIcon
} from './SidebarColorfulIcons';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: DashboardColorIcon },
  { path: '/portfolio', label: 'My Portfolio', icon: PortfolioColorIcon },
  { path: '/live-prices', label: 'Live Prices', icon: LivePricesColorIcon },
  { path: '/transactions', label: 'Transactions', icon: TransactionsColorIcon },
  { path: '/tax-center', label: 'Tax Center', icon: TaxCenterColorIcon },
  { path: '/rule-book', label: 'Tax Rule Book', icon: TaxRuleBookColorIcon },
  { path: '/ipo-tracker', label: 'IPO Tracker', icon: IpoTrackerColorIcon },
  { path: '/reports', label: 'Reports', icon: ReportsColorIcon },
  { path: '/settings', label: 'Settings', icon: SettingsColorIcon }
];

export const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const { profile } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 25, 47, 0.65)',
            zIndex: 150,
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Logo Header - Matching Navbar Height & Luxury Styling */}
        <div
          style={{
            height: '66px',
            padding: isCollapsed && !isMobileOpen ? '0 10px' : '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
            borderBottom: '2px solid #E5A93C',
            backgroundColor: '#07192F',
            flexShrink: 0
          }}
        >
          {isCollapsed && !isMobileOpen ? (
            /* Collapsed Sidebar: Centered Bull Emblem with Electric Backlight */
            <div
              style={{
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src={logoImg}
                alt="NetNafa Bull"
                style={{
                  height: '34px',
                  width: 'auto',
                  maxWidth: 'none',
                  objectFit: 'contain',
                  transform: 'translateX(34%) scale(1.6)',
                  filter: 'drop-shadow(0 0 10px rgba(0, 160, 255, 0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) brightness(1.15) contrast(1.15)'
                }}
              />
            </div>
          ) : (
            /* Expanded Sidebar: Full Glowing Logo + Vertical Divider */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingRight: '2px'
              }}
            >
              <img
                src={logoImg}
                alt="NetNafa"
                style={{
                  height: '38px',
                  width: 'auto',
                  maxWidth: '185px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 10px rgba(0, 160, 255, 0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) brightness(1.15) contrast(1.15)'
                }}
              />
              {/* Sleek Vertical Divider matching navbar */}
              <div
                style={{
                  width: '1px',
                  height: '28px',
                  background: 'linear-gradient(to bottom, transparent, rgba(229, 169, 60, 0.45), transparent)',
                  marginRight: '2px',
                  flexShrink: 0
                }}
              />
            </div>
          )}

          {/* Close button inside mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="mobile-close-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              padding: '6px',
              borderRadius: '6px',
              display: isMobileOpen ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '8px'
            }}
            title="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '14px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const showLabel = !isCollapsed || isMobileOpen;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobileOpen && onCloseMobile) onCloseMobile();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: showLabel ? '12px' : '0',
                  justifyContent: showLabel ? 'flex-start' : 'center',
                  padding: showLabel ? '8px 12px' : '10px 0',
                  borderRadius: '10px',
                  color: isActive ? '#0056D2' : '#334155',
                  backgroundColor: isActive ? '#EDF4FE' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  borderLeft: isActive ? '3px solid #0056D2' : '3px solid transparent',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 86, 210, 0.08)' : 'none'
                })}
                title={!showLabel ? item.label : undefined}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid rgba(226, 232, 240, 0.7)',
                    boxShadow: '0 1px 3px rgba(11, 37, 69, 0.04), inset 0 1px 1px #FFFFFF',
                    flexShrink: 0,
                    transition: 'transform 0.18s ease'
                  }}
                >
                  <Icon size={20} />
                </div>
                {showLabel && <span style={{ letterSpacing: '0.01em' }}>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
