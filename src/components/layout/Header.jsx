import React from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_FINANCIAL_YEARS } from '../../utils/constants/taxRules';
import { Menu, Calendar, Bell, Search } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Header = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const { selectedFy, setSelectedFy, profile } = useApp();

  return (
    <header
      className="app-header"
      style={{
        height: '66px',
        minHeight: '66px',
        flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(7, 25, 47, 0.98) 0%, rgba(11, 37, 69, 0.98) 60%, rgba(14, 53, 97, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(10px, 2vw, 24px)',
        borderBottom: '2px solid #E5A93C',
        boxShadow: '0 4px 14px rgba(7, 25, 47, 0.35)',
        zIndex: 100,
        position: 'sticky',
        top: 0
      }}
    >
      {/* Left section: Hamburger, Collapsed Logo (if any) & Slogan Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.2vw, 16px)', minWidth: 0 }}>
        {/* Hamburger Toggle Button */}
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'rgba(15, 34, 64, 0.75)',
            border: '1.5px solid rgba(147, 197, 253, 0.28)',
            color: '#ECC46A',
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            boxShadow: '0 0 12px rgba(0, 102, 255, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
          }}
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        {/* When sidebar is collapsed on desktop, show glowing brand logo + divider */}
        {isSidebarCollapsed && (
          <div
            className="header-collapsed-brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}
          >
            <img
              src={logoImg}
              alt="NetNafa"
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(0, 160, 255, 0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) brightness(1.15) contrast(1.15)'
              }}
            />
            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'linear-gradient(to bottom, transparent, rgba(229, 169, 60, 0.45), transparent)'
              }}
            />
          </div>
        )}

        {/* Brand Logo in header: Only visible on mobile when sidebar drawer is hidden */}
        <div
          className="header-mobile-only-logo"
          style={{
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <img
            src={logoImg}
            alt="NetNafa"
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(0, 160, 255, 0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) brightness(1.15) contrast(1.15)'
            }}
          />
        </div>

        {/* Desktop Slogan Capsule Pill: visible only on desktop */}
        <div className="header-desktop-tagline">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: 'rgba(7, 25, 47, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(229, 169, 60, 0.6)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(229, 169, 60, 0.15)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981, 0 0 14px rgba(16, 185, 129, 0.7)',
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              KNOW YOUR INVESTMENTS.{' '}
              <span style={{ color: '#ECC46A' }}>MASTER YOUR RETURNS.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right section: FY Selector Pill, Notification Bell, Search, Profile Avatar with Diamond Star */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.4vw, 16px)', flexShrink: 0 }}>
        {/* Financial Year Selector Pill Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(7, 25, 47, 0.65)',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1.5px solid rgba(229, 169, 60, 0.6)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
            flexShrink: 0
          }}
        >
          <Calendar size={13} color="#ECC46A" />
          <span style={{ fontSize: '11.5px', color: '#FFFFFF', fontWeight: 700 }}>FY:</span>
          <select
            value={selectedFy}
            onChange={(e) => setSelectedFy(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ECC46A',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              outline: 'none',
              padding: '0'
            }}
          >
            {AVAILABLE_FINANCIAL_YEARS.map((fy) => (
              <option key={fy} value={fy} style={{ color: '#0F172A', background: '#FFFFFF' }}>
                {fy}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Bell Icon Button */}
        <button
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#CBD5E1',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Search Icon Button */}
        <button
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#CBD5E1',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          title="Search"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* User Profile Avatar with Diamond Star Sparkle & Online Indicator */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '2px',
            flexShrink: 0
          }}
        >
          {/* 4-point Diamond Star Sparkle Glint above avatar */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: 'absolute',
              top: '-7px',
              right: '-5px',
              zIndex: 4,
              filter: 'drop-shadow(0 0 5px #93C5FD)'
            }}
          >
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="#93C5FD"
              opacity="0.9"
            />
          </svg>

          {/* Circular Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #07192F 100%)',
              border: '2px solid #ECC46A',
              boxShadow: '0 0 10px rgba(236, 196, 106, 0.35), 0 2px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              position: 'relative'
            }}
          >
            {profile?.investorName ? profile.investorName.charAt(0).toUpperCase() : 'A'}

            {/* Small Green Online Status Dot on circle rim */}
            <span
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '1.5px solid #07192F',
                boxShadow: '0 0 6px #10B981',
                zIndex: 3
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
