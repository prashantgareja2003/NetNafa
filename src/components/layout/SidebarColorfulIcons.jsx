import React from 'react';

/**
 * High-definition, multi-color modern SVG icons for the NetNafa Sidebar
 */

export const DashboardColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="dashG1" x1="2" y1="2" x2="11" y2="11" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="dashG2" x1="13" y1="2" x2="22" y2="11" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
      <linearGradient id="dashG3" x1="2" y1="13" x2="11" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EF4444" />
      </linearGradient>
      <linearGradient id="dashG4" x1="13" y1="13" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="2.5" width="8" height="8" rx="2.5" fill="url(#dashG1)" />
    <rect x="13.5" y="2.5" width="8" height="8" rx="2.5" fill="url(#dashG2)" />
    <rect x="2.5" y="13.5" width="8" height="8" rx="2.5" fill="url(#dashG3)" />
    <rect x="13.5" y="13.5" width="8" height="8" rx="2.5" fill="url(#dashG4)" />
    {/* Inner card accent lines */}
    <circle cx="6.5" cy="6.5" r="1.5" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="#FFFFFF" fillOpacity="0.85" />
    <rect x="4.5" y="17" width="4" height="1.5" rx="0.75" fill="#FFFFFF" fillOpacity="0.85" />
    <rect x="15.5" y="17" width="4" height="1.5" rx="0.75" fill="#FFFFFF" fillOpacity="0.85" />
  </svg>
);

export const PortfolioColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="portG1" x1="12" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="portG2" x1="12" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
      <linearGradient id="portG3" x1="2" y1="12" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
      <linearGradient id="portG4" x1="2" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E11D48" />
        <stop offset="1" stopColor="#FB7185" />
      </linearGradient>
    </defs>
    {/* Segment 1: Top-Right (Blue) */}
    <path
      d="M13.5 2.1C18.2 2.6 21.9 6.3 22.4 11H13.5V2.1Z"
      fill="url(#portG1)"
    />
    {/* Segment 2: Bottom-Right (Emerald) */}
    <path
      d="M22.4 13C21.8 17.8 17.8 21.8 13 22.4V13H22.4Z"
      fill="url(#portG2)"
    />
    {/* Segment 3: Bottom-Left (Gold) */}
    <path
      d="M11 22.4C6.2 21.8 2.5 17.8 2.1 13H11V22.4Z"
      fill="url(#portG3)"
    />
    {/* Segment 4: Top-Left (Rose) */}
    <path
      d="M2.1 11C2.6 6.2 6.2 2.5 11 2.1V11H2.1Z"
      fill="url(#portG4)"
    />
    {/* Center Core Hole with Glow */}
    <circle cx="12" cy="12" r="4.2" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="2.5" fill="#07192F" />
  </svg>
);

export const LivePricesColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="coinGrad" x1="10" y1="2" x2="22" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.5" stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="candleUp" x1="3" y1="5" x2="7" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="candleDown" x1="8" y1="10" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F43F5E" />
        <stop offset="1" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    {/* Green Bull Candlestick */}
    <line x1="5" y1="3" x2="5" y2="21" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="3.5" y="6" width="3" height="9" rx="1.5" fill="url(#candleUp)" />
    
    {/* Red Candlestick */}
    <line x1="10" y1="8" x2="10" y2="22" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="8.5" y="11" width="3" height="8" rx="1.5" fill="url(#candleDown)" />

    {/* Golden Coin in Upper Right */}
    <circle cx="17" cy="7" r="5.5" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
    <circle cx="17" cy="7" r="4.2" stroke="#FEF3C7" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    {/* Rupee Symbol inside coin */}
    <path
      d="M15.5 5.2H18.5M15.5 6.4H18M16.5 6.4C17.4 6.4 17.8 7 17.5 7.6C17.2 8.1 16.7 8.3 16 8.3L18.2 9.8M16.5 5.2V9.8"
      stroke="#78350F"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TransactionsColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="transRight" x1="3" y1="5" x2="21" y2="9" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="transLeft" x1="21" y1="15" x2="3" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Top Right Arrow (Buy / Investment) */}
    <path
      d="M3 7.5H18M18 7.5L14 3.5M18 7.5L14 11.5"
      stroke="url(#transRight)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="5" cy="7.5" r="2.5" fill="#3B82F6" />
    <circle cx="5" cy="7.5" r="1.2" fill="#FFFFFF" />

    {/* Bottom Left Arrow (Sell / Liquidity) */}
    <path
      d="M21 16.5H6M6 16.5L10 12.5M6 16.5L10 20.5"
      stroke="url(#transLeft)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="16.5" r="2.5" fill="#10B981" />
    <circle cx="19" cy="16.5" r="1.2" fill="#FFFFFF" />
  </svg>
);

export const TaxCenterColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="taxShield" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F2A4D" />
        <stop offset="1" stopColor="#07192F" />
      </linearGradient>
      <linearGradient id="goldRim" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.5" stopColor="#FDE68A" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Shield Body */}
    <path
      d="M12 2L4 5.5V11.2C4 16.5 7.4 21.4 12 22.5C16.6 21.4 20 16.5 20 11.2V5.5L12 2Z"
      fill="url(#taxShield)"
      stroke="url(#goldRim)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Golden Rupee / Tax Symbol inside */}
    <path
      d="M9.5 8H14.5M9.5 9.8H13.8M11 9.8C12.3 9.8 13.2 10.6 12.8 11.6C12.4 12.4 11.6 12.8 10.5 12.8L13.8 16M11 8V16"
      stroke="#FBBF24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Verified Green Badge at Bottom-Right */}
    <circle cx="17.5" cy="17.5" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
    <path d="M16.2 17.5L17.2 18.5L19 16.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TaxRuleBookColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="bookCover" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0D2D56" />
        <stop offset="1" stopColor="#040E1B" />
      </linearGradient>
      <linearGradient id="bookPages" x1="4" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFDF7" />
        <stop offset="1" stopColor="#EADBCE" />
      </linearGradient>
      <linearGradient id="goldStitch" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Left Page Spread */}
    <path
      d="M3 5.5C5.5 4.5 9 5 12 6.5V20.5C9 19 5.5 18.5 3 19.5V5.5Z"
      fill="url(#bookPages)"
      stroke="url(#bookCover)"
      strokeWidth="1.2"
    />
    {/* Right Page Spread */}
    <path
      d="M21 5.5C18.5 4.5 15 5 12 6.5V20.5C15 19 18.5 18.5 21 19.5V5.5Z"
      fill="url(#bookPages)"
      stroke="url(#bookCover)"
      strokeWidth="1.2"
    />
    {/* Center Spine */}
    <line x1="12" y1="6.5" x2="12" y2="20.5" stroke="url(#goldStitch)" strokeWidth="1.8" />
    
    {/* Red Bookmark Ribbon */}
    <path
      d="M11 3.5V9.5L12 8.5L13 9.5V3.5H11Z"
      fill="#EF4444"
    />
    
    {/* Gold Sparkle Star */}
    <circle cx="17" cy="8.5" r="1.5" fill="#F59E0B" />
    <circle cx="7" cy="9.5" r="1.2" fill="#3B82F6" />
  </svg>
);

export const IpoTrackerColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="rocketBody" x1="8" y1="2" x2="20" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="rocketNose" x1="14" y1="2" x2="22" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF4444" />
        <stop offset="1" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="rocketFlame" x1="4" y1="16" x2="10" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.5" stopColor="#EF4444" />
        <stop offset="1" stopColor="#FDE047" />
      </linearGradient>
    </defs>
    {/* Exhaust Flames */}
    <path
      d="M4.5 17.5C4 19 3 21.5 5 22C6.5 22.5 8 20.5 8.5 19.5L4.5 17.5Z"
      fill="url(#rocketFlame)"
    />
    <path
      d="M7 16.5C8 18 9 21 10.5 20.5C11.5 20 10.5 18 10 17L7 16.5Z"
      fill="#F59E0B"
    />

    {/* Wings */}
    <path d="M7 15L3 13.5L5 9.5L9.5 12.5L7 15Z" fill="#F43F5E" />
    <path d="M15 7L13.5 3L9.5 5L12.5 9.5L15 7Z" fill="#F43F5E" />

    {/* Rocket Fuselage */}
    <path
      d="M9.5 12.5C8.5 9 10.5 5.5 15 3.5C17.5 2.5 21 2.5 22 3.5C22.5 4.5 22 8 20.5 10.5C18.5 15 15 17 11.5 16L9.5 12.5Z"
      fill="url(#rocketBody)"
    />
    {/* Nose Cone */}
    <path
      d="M18.5 4.5C20.5 3.5 21.5 3.5 22 3.5C22.5 4 22 5 21 7L18.5 4.5Z"
      fill="url(#rocketNose)"
    />
    {/* Porthole Window */}
    <circle cx="16" cy="8" r="2.2" fill="#FDE047" stroke="#1E3A8A" strokeWidth="1" />
  </svg>
);

export const ReportsColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="sheetGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="cornerFold" x1="15" y1="2" x2="20" y2="7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Document Body */}
    <path
      d="M4 4C4 2.9 4.9 2 6 2H15L20 7V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4Z"
      fill="url(#sheetGrad)"
      stroke="#CBD5E1"
      strokeWidth="1.2"
    />
    {/* Folded Corner */}
    <path d="M15 2V7H20L15 2Z" fill="url(#cornerFold)" />

    {/* Color Analytics Bars on Document */}
    <rect x="7" y="14" width="2.2" height="5" rx="1" fill="#3B82F6" />
    <rect x="10.8" y="11" width="2.2" height="8" rx="1" fill="#10B981" />
    <rect x="14.6" y="8" width="2.2" height="11" rx="1" fill="#F59E0B" />

    {/* Document Header Line */}
    <rect x="7" y="5" width="5.5" height="1.8" rx="0.9" fill="#94A3B8" />
  </svg>
);

export const SettingsColorIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
  >
    <defs>
      <linearGradient id="gearGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="0.5" stopColor="#3B82F6" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="hubGrad" x1="8" y1="8" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Gear Outer Teeth */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8 2.2C11.3 2 11.9 2 12.4 2C12.9 2 13.5 2 14 2.2L14.5 4.3C15.2 4.6 15.8 5 16.4 5.5L18.4 4.7C19.2 5.2 19.9 5.9 20.4 6.7L19.5 8.7C19.9 9.3 20.3 10 20.6 10.7L22.6 11.2C22.7 11.7 22.8 12.3 22.8 12.8C22.8 13.4 22.7 14 22.6 14.5L20.6 15C20.3 15.7 19.9 16.4 19.5 17L20.4 19C19.9 19.8 19.2 20.5 18.4 21L16.4 20.2C15.8 20.7 15.2 21.1 14.5 21.4L14 23.5C13.5 23.7 12.9 23.7 12.4 23.7C11.9 23.7 11.3 23.7 10.8 23.5L10.3 21.4C9.6 21.1 9 20.7 8.4 20.2L6.4 21C5.6 20.5 4.9 19.8 4.4 19L5.3 17C4.9 16.4 4.5 15.7 4.2 15L2.2 14.5C2.1 14 2 13.4 2 12.8C2 12.3 2.1 11.7 2.2 11.2L4.2 10.7C4.5 10 4.9 9.3 5.3 8.7L4.4 6.7C4.9 5.9 5.6 5.2 6.4 4.7L8.4 5.5C9 5 9.6 4.6 10.3 4.3L10.8 2.2Z"
      fill="url(#gearGrad)"
    />
    {/* Inner Golden Hub */}
    <circle cx="12" cy="12.8" r="4.8" fill="url(#hubGrad)" stroke="#FFFFFF" strokeWidth="1" />
    {/* Center Hole */}
    <circle cx="12" cy="12.8" r="2.2" fill="#07192F" />
  </svg>
);
