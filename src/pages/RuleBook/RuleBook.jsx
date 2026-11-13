import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Printer,
  Scale,
  Calculator,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  TAX_RULES_DATA,
  TAX_CHEAT_SHEET
} from '../../utils/constants/taxRuleBookData';

export const RuleBook = () => {
  // Interactive Quick Tax Rule Checker State
  const [buyDate, setBuyDate] = useState('2025-01-15');
  const [sellDate, setSellDate] = useState('2025-10-20');
  const [profitAmount, setProfitAmount] = useState('50000');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Real Book Current Page Index (0 = Cover/TOC, 1..9 = Rule Pages, 10 = Summary/Cheat-sheet)
  const [currentPage, setCurrentPage] = useState(0);
  // Flipping State: null | { direction: 'next' | 'prev', from: number, to: number }
  const [flippingState, setFlippingState] = useState(null);

  const lastScrollTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const bookContainerRef = useRef(null);

  // Total pages in the book (0 to 10 = 11 pages)
  const totalBookPages = TAX_RULES_DATA.length + 2;

  // Page Titles for Chapter Navigation
  const bookChapters = useMemo(() => [
    { page: 0, titleEn: 'Cover & Index', titleGu: 'મુખપૃષ્ઠ & અનુક્રમણિકા', section: 'Cover' },
    ...TAX_RULES_DATA.map((rule, idx) => ({
      page: idx + 1,
      titleEn: rule.en.title,
      titleGu: rule.gu.title,
      section: rule.section,
      badge: rule.badge
    })),
    { page: 10, titleEn: 'Budget 2024 Summary & Guidelines', titleGu: 'બજેટ ૨૦૨૪ સારાંશ', section: 'Summary' }
  ], []);

  // Turn to Next Page with realistic 3D paper flip
  const handleNextPage = () => {
    if (currentPage < totalBookPages - 1 && !flippingState) {
      const to = currentPage + 1;
      setFlippingState({ direction: 'next', from: currentPage, to });
      setTimeout(() => {
        setCurrentPage(to);
        setFlippingState(null);
      }, 720);
    }
  };

  // Turn to Previous Page with realistic 3D paper flip
  const handlePrevPage = () => {
    if (currentPage > 0 && !flippingState) {
      const to = currentPage - 1;
      setFlippingState({ direction: 'prev', from: currentPage, to });
      setTimeout(() => {
        setCurrentPage(to);
        setFlippingState(null);
      }, 720);
    }
  };

  // Jump to specific chapter/page
  const handleJumpToPage = (targetPage) => {
    if (targetPage === currentPage || flippingState) return;
    const direction = targetPage > currentPage ? 'next' : 'prev';
    setFlippingState({ direction, from: currentPage, to: targetPage });
    setTimeout(() => {
      setCurrentPage(targetPage);
      setFlippingState(null);
    }, 720);
  };

  // Lock parent .main-content scroll while RuleBook is mounted so outer page never scrolls vertically
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const prevOverflowY = mainContent.style.overflowY;
      mainContent.style.overflowY = 'hidden';
      mainContent.scrollTop = 0;
      return () => {
        mainContent.style.overflowY = prevOverflowY;
      };
    }
  }, []);

  // Native non-passive wheel event listener to strictly prevent outer page scrolling
  useEffect(() => {
    const el = bookContainerRef.current;
    if (!el) return;

    const handleWheelNative = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 600 || flippingState) return;

      if (e.deltaY > 20) {
        if (currentPage < totalBookPages - 1) {
          lastScrollTime.current = now;
          handleNextPage();
        }
      } else if (e.deltaY < -20) {
        if (currentPage > 0) {
          lastScrollTime.current = now;
          handlePrevPage();
        }
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, [currentPage, flippingState, totalBookPages]);

  // Touch Swipe Handlers for Mobile & Tablet
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (flippingState) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe gesture detection (minimum 40px threshold)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNextPage(); // Swiped left -> next
      } else {
        handlePrevPage(); // Swiped right -> prev
      }
    } else if (Math.abs(diffY) > 50) {
      // Vertical swipe gesture detection
      if (diffY < 0) {
        handleNextPage(); // Swiped up -> next
      } else {
        handlePrevPage(); // Swiped down -> prev
      }
    }
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (flippingState) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, flippingState]);

  // Quick Checker Calculation
  const checkerResult = useMemo(() => {
    if (!buyDate || !sellDate) return null;
    const b = new Date(buyDate);
    const s = new Date(sellDate);
    if (isNaN(b.getTime()) || isNaN(s.getTime()) || s < b) {
      return { error: true };
    }

    const diffMs = s.getTime() - b.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const profit = parseFloat(profitAmount) || 0;

    const isLtcg = diffDays > 365;
    const section = isLtcg ? 'Section 112A (LTCG)' : 'Section 111A (STCG)';
    const sectionGu = isLtcg ? 'કલમ 112A (લોંગ-ટર્મ)' : 'કલમ 111A (શોર્ટ-ટર્મ)';
    const rate = isLtcg ? '12.5%' : '20%';

    let taxableProfit = profit;
    let baseTax = 0;

    if (profit > 0) {
      if (isLtcg) {
        taxableProfit = Math.max(0, profit - 125000);
        baseTax = taxableProfit * 0.125;
      } else {
        baseTax = profit * 0.20;
      }
    }

    const cess = baseTax * 0.04;
    const totalTax = baseTax + cess;

    return {
      error: false,
      diffDays,
      diffMonths: (diffDays / 30.4375).toFixed(1),
      isLtcg,
      section,
      sectionGu,
      rate,
      profit,
      taxableProfit,
      baseTax,
      cess,
      totalTax
    };
  }, [buyDate, sellDate, profitAmount]);

  const handlePrint = () => {
    window.print();
  };

  /**
   * Helper to render the Left Page content for any given page index
   */
  const renderLeftPage = (pageIdx) => {
    if (pageIdx === 0) {
      // Cover Page Title & Insignia with Claymorphic Bevel
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div
            style={{
              border: '2px solid rgba(229, 169, 60, 0.75)',
              borderRadius: '16px',
              padding: 'clamp(14px, 2.2vw, 24px)',
              background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFDF9 60%, #FAF5EC 100%)',
              boxShadow: '6px 10px 24px rgba(229, 169, 60, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 1), inset -2px -2px 5px rgba(229, 169, 60, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'center'
            }}
          >
            <span
              className="clay-badge-navy"
              style={{
                letterSpacing: '1.5px',
                fontSize: '10px'
              }}
            >
              GOVERNMENT OF INDIA • STATUTORY COMPLIANCE
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(20px, 2.4vw, 26px)',
                color: '#07192F',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              THE STATUTORY TAX RULE BOOK
            </h2>

            <div
              style={{
                width: '50px',
                height: '3px',
                backgroundColor: '#E5A93C',
                borderRadius: '9999px',
                margin: '2px 0',
                boxShadow: '0 2px 6px rgba(229, 169, 60, 0.4)'
              }}
            />

            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                color: '#B45309',
                margin: 0,
                fontWeight: 700
              }}
            >
              ભારતીય શેરબજાર કર નિયમો સંગ્રહ
            </h3>

            <p
              style={{
                fontSize: '12px',
                color: '#475569',
                lineHeight: 1.5,
                maxWidth: '380px',
                margin: 0
              }}
            >
              Comprehensive Capital Gains Guide for Listed Equities under the Income Tax Act, 1961 as amended by Finance (No. 2) Act, 2024.
            </p>

            <div
              className="clay-pill-success"
              style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px'
              }}
            >
              <Sparkles size={13} />
              Budget 2024 Rates Enacted (STCG 20% | LTCG 12.5%)
            </div>

            <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748B' }}>
              Scroll down ↓ or use arrows to flip pages
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: '10.5px',
              color: '#94A3B8',
              marginTop: '8px'
            }}
          >
            ~ NetNafa Official • Edition 2026 ~
          </div>
        </div>
      );
    }

    if (pageIdx >= 1 && pageIdx <= TAX_RULES_DATA.length) {
      const rule = TAX_RULES_DATA[pageIdx - 1];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1.5px solid #E2E8F0',
                paddingBottom: '6px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="clay-badge-navy">
                  {rule.section}
                </span>
                <span
                  className={
                    rule.badgeType === 'warning'
                      ? 'clay-pill-warning'
                      : rule.badgeType === 'success'
                      ? 'clay-pill-success'
                      : 'clay-pill-blue'
                  }
                >
                  {rule.badge}
                </span>
              </div>
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>
                English Edition
              </span>
            </div>

            <RuleContentBox
              lang="en"
              title={rule.en.title}
              subtitle={rule.en.subtitle}
              applicability={rule.en.applicability}
              holdingPeriod={rule.en.holdingPeriod}
              taxRate={rule.en.taxRate}
              exemption={rule.en.exemption}
              calculationFormula={rule.en.calculationFormula}
              example={rule.en.example}
              keyTakeaways={rule.en.keyTakeaways}
            />
          </div>

          <div
            style={{
              textAlign: 'left',
              fontSize: '10.5px',
              color: '#94A3B8',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '6px',
              marginTop: '10px'
            }}
          >
            Page {pageIdx * 2} • Section {rule.section}
          </div>
        </div>
      );
    }

    // Page 10 (Summary)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px solid #047857',
              paddingBottom: '6px',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} style={{ color: '#047857' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#065F46', margin: 0 }}>
                Budget 2024 Quick Cheat-Sheet
              </h3>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 7px', borderRadius: '10px' }}>
              Finance (No. 2) Act
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1' }}>
                  <th style={{ padding: '5px 6px', textAlign: 'left' }}>Provision / કલમ</th>
                  <th style={{ padding: '5px 6px', textAlign: 'left', color: '#047857' }}>Budget 2024</th>
                  <th style={{ padding: '5px 6px', textAlign: 'left', color: '#64748B' }}>Pre-Budget</th>
                </tr>
              </thead>
              <tbody>
                {TAX_CHEAT_SHEET.slice(0, 6).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '5px 6px', fontWeight: 600 }}>{row.paramEn}</td>
                    <td style={{ padding: '5px 6px', fontWeight: 700, color: '#065F46' }}>{row.budget2024}</td>
                    <td style={{ padding: '5px 6px', color: '#64748B' }}>{row.preBudget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'left', fontSize: '10.5px', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '10px' }}>
          Page 20 • Quick Summary Reference
        </div>
      </div>
    );
  };

  /**
   * Helper to render the Right Page content for any given page index
   */
  const renderRightPage = (pageIdx) => {
    if (pageIdx === 0) {
      // Table of Contents
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #E5A93C',
                paddingBottom: '6px',
                marginBottom: '10px'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '16px',
                  color: '#07192F',
                  margin: 0
                }}
              >
                Table of Contents (અનુક્રમણિકા)
              </h3>
              <span style={{ fontSize: '10.5px', color: '#8C650A', fontWeight: 700 }}>
                9 STATUTORY CHAPTERS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {TAX_RULES_DATA.map((rule, idx) => (
                <button
                  key={rule.id}
                  type="button"
                  className="clay-chapter-card"
                  onClick={() => handleJumpToPage(idx + 1)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span className="clay-badge-navy" style={{ whiteSpace: 'nowrap' }}>
                      {rule.section}
                    </span>
                    <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }}>
                        {rule.en.title}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>
                        {rule.gu.title}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#2563EB', flexShrink: 0, paddingLeft: '6px' }}>
                    Pg {idx + 2} →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: '10px',
              color: '#94A3B8',
              marginTop: '6px',
              borderTop: '1px dashed #CBD5E1',
              paddingTop: '6px'
            }}
          >
            Click any chapter or scroll down to turn page
          </div>
        </div>
      );
    }

    if (pageIdx >= 1 && pageIdx <= TAX_RULES_DATA.length) {
      const rule = TAX_RULES_DATA[pageIdx - 1];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1.5px solid #F6D68F',
                paddingBottom: '6px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="clay-badge-gold">
                  {rule.section}
                </span>
                <span
                  className={
                    rule.badgeType === 'warning'
                      ? 'clay-pill-warning'
                      : rule.badgeType === 'success'
                      ? 'clay-pill-success'
                      : 'clay-pill-blue'
                  }
                >
                  {rule.badge}
                </span>
              </div>
              <span style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 700 }}>
                ગુજરાતી આવૃત્તિ
              </span>
            </div>

            <RuleContentBox
              lang="gu"
              title={rule.gu.title}
              subtitle={rule.gu.subtitle}
              applicability={rule.gu.applicability}
              holdingPeriod={rule.gu.holdingPeriod}
              taxRate={rule.gu.taxRate}
              exemption={rule.gu.exemption}
              calculationFormula={rule.gu.calculationFormula}
              example={rule.gu.example}
              keyTakeaways={rule.gu.keyTakeaways}
            />
          </div>

          <div
            style={{
              textAlign: 'right',
              fontSize: '10.5px',
              color: '#94A3B8',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '6px',
              marginTop: '10px'
            }}
          >
            પાનું {pageIdx * 2 + 1} • {rule.section}
          </div>
        </div>
      );
    }

    // Page 10 (Compliance & Seal)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px solid #E5A93C',
              paddingBottom: '6px',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: '#8C650A' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#07192F', margin: 0 }}>
                Important Compliance &amp; ITR Guidelines
              </h3>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#B45309' }}>
              કાનૂની માર્ગદર્શિકા
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                padding: '8px 11px',
                borderRadius: '12px',
                boxShadow: '3px 4px 10px rgba(11, 37, 69, 0.04), inset 1.5px 1.5px 2px #FFFFFF, inset -1.5px -1.5px 3px rgba(11, 37, 69, 0.02)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#07192F', marginBottom: '2px' }}>
                1. Advance Tax Deadlines (એડવાન્સ ટેક્સ તારીખો):
              </div>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.45 }}>
                If total tax liability exceeds ₹10,000, pay in 4 installments: 15% by 15-Jun, 45% by 15-Sep, 75% by 15-Dec, and 100% by 15-Mar to avoid interest under Sections 234B &amp; 234C.
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #FEF2F2 0%, #FEE2E2 100%)',
                border: '1.5px solid #FECACA',
                padding: '8px 11px',
                borderRadius: '12px',
                boxShadow: '3px 4px 10px rgba(185, 28, 28, 0.08), inset 1.5px 1.5px 2px #FFFFFF, inset -1.5px -1.5px 3px rgba(185, 28, 28, 0.04)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#991B1B', marginBottom: '2px' }}>
                2. Strict Loss Carry-Forward Deadline (ITR Sec 139(1)):
              </div>
              <div style={{ fontSize: '11px', color: '#7F1D1D', lineHeight: 1.45 }}>
                To carry forward equity trading losses for up to 8 years, you MUST file your ITR on or before 31st July of the Assessment Year. Late returns permanently forfeit loss benefits.
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1.5px solid #FDE68A',
                padding: '8px 11px',
                borderRadius: '12px',
                boxShadow: '3px 4px 10px rgba(217, 119, 6, 0.08), inset 1.5px 1.5px 2px #FFFFFF, inset -1.5px -1.5px 3px rgba(217, 119, 6, 0.04)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>
                3. Chartered Accountant Consultation Advice:
              </div>
              <div style={{ fontSize: '10.5px', color: '#78350F', lineHeight: 1.4 }}>
                Tax rules are compiled strictly from Income Tax Act, 1961 provisions. Verify final computations with your Chartered Accountant (CA) before filing ITR-2 or ITR-3.
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '10px' }}>
          Page 21 • NetNafa Rule Book Concluded
        </div>
      </div>
    );
  };

  // Determine what each side displays depending on whether flipping animation is running
  const leftPageContent = useMemo(() => {
    if (flippingState?.direction === 'prev') {
      return renderLeftPage(flippingState.to);
    }
    return renderLeftPage(currentPage);
  }, [flippingState, currentPage]);

  const rightPageContent = useMemo(() => {
    if (flippingState?.direction === 'next') {
      return renderRightPage(flippingState.to);
    }
    return renderRightPage(currentPage);
  }, [flippingState, currentPage]);

  return (
    <div className="rule-book-container">
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
          margin: 0,
          padding: '2px 0'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #102A4D 0%, #07192F 100%)',
                color: '#E5A93C',
                boxShadow: '4px 6px 14px rgba(7, 25, 47, 0.25), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.3), inset -1.5px -1.5px 3px rgba(0, 0, 0, 0.4)'
              }}
            >
              <BookOpen size={20} />
            </span>
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--color-navy-dark)',
                  margin: 0
                }}
              >
                The Indian Stock Tax Rule Book
              </h1>
              <p
                style={{
                  fontSize: '12.5px',
                  color: 'var(--color-text-secondary)',
                  margin: '2px 0 0 0'
                }}
              >
                ભારતીય શેરબજાર કર નિયમો સંગ્રહ – Interactive 3D Real Book Experience
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          {/* Quick Calculator Toggle */}
          <button
            type="button"
            className={`clay-btn ${isCalculatorOpen ? 'clay-btn-active' : ''}`}
            onClick={() => setIsCalculatorOpen((prev) => !prev)}
          >
            <Calculator size={15} />
            {isCalculatorOpen ? 'Hide Simulator' : 'Rule Simulator'}
          </button>

          {/* Print Button */}
          <button
            type="button"
            className="clay-btn"
            onClick={handlePrint}
            title="Print or Save as PDF"
          >
            <Printer size={15} />
            Print
          </button>
        </div>
      </div>

      {/* Interactive Quick Tax Rule Checker Drawer */}
      {isCalculatorOpen && (
        <div className="clay-simulator-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  padding: '6px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  color: '#2563EB',
                  boxShadow: 'inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.9), inset -1.5px -1.5px 3px rgba(37, 99, 235, 0.1)'
                }}
              >
                <Calculator size={16} />
              </span>
              <div>
                <h3
                  style={{
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: 'var(--color-navy-dark)',
                    margin: 0
                  }}
                >
                  Quick Tax Rule Checker / કયો નિયમ લાગુ પડે છે તે ચકાસો
                </h3>
              </div>
            </div>
            <span className="clay-pill-blue">
              Live Simulator
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              alignItems: 'flex-end'
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  marginBottom: '3px'
                }}
              >
                1. Purchase Date (ખરીદી તારીખ)
              </label>
              <input
                type="date"
                className="form-control clay-input"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                style={{ width: '100%', fontSize: '12.5px' }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  marginBottom: '3px'
                }}
              >
                2. Sale Date (વેચાણ તારીખ)
              </label>
              <input
                type="date"
                className="form-control clay-input"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                style={{ width: '100%', fontSize: '12.5px' }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  marginBottom: '3px'
                }}
              >
                3. Realized Profit (ચોખ્ખો નફો ₹)
              </label>
              <input
                type="number"
                className="form-control clay-input"
                value={profitAmount}
                onChange={(e) => setProfitAmount(e.target.value)}
                placeholder="50000"
                style={{ width: '100%', fontSize: '12.5px' }}
              />
            </div>
          </div>

          {checkerResult && !checkerResult.error && (
            <div
              style={{
                marginTop: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '10px'
              }}
            >
              <div className="clay-result-pill">
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Holding Duration
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                  {checkerResult.diffDays} Days ({checkerResult.diffMonths} mo)
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
                  {checkerResult.isLtcg ? '> 365 Days → Long-Term' : '≤ 365 Days → Short-Term'}
                </span>
              </div>

              <div className="clay-result-pill">
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Applicable Section
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: checkerResult.isLtcg ? '#166534' : '#92400E' }}>
                  {checkerResult.section}
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
                  {checkerResult.sectionGu}
                </span>
              </div>

              <div className="clay-result-pill">
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Tax Rate &amp; Exemption
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                  {checkerResult.rate} Flat
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
                  {checkerResult.isLtcg ? '₹1.25L Exemption applies' : 'No basic exemption'}
                </span>
              </div>

              <div className="clay-result-pill">
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Estimated Tax (inc. 4% Cess)
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: checkerResult.totalTax > 0 ? '#B91C1C' : '#16A34A' }}>
                  ₹{Math.round(checkerResult.totalTax).toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
                  {checkerResult.totalTax === 0 && checkerResult.isLtcg
                    ? '100% Tax Free under ₹1.25L limit'
                    : `Base: ₹${Math.round(checkerResult.baseTax).toLocaleString('en-IN')} + Cess: ₹${Math.round(checkerResult.cess).toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* REAL 3D FLIP-BOOK CONTAINER (FILLS FULL PAGE VIEWPORT)       */}
      {/* ============================================================ */}
      <div
        ref={bookContainerRef}
        className="real-book-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Outer Hardcover Leather / Navy Binder */}
        <div className="real-book-binder">
          {/* Golden Bookmark Ribbon dangling in center */}
          <div className="real-book-ribbon" title="Bookmark" />

          {/* Side Navigation Arrow: Previous Page */}
          <button
            type="button"
            className="book-nav-btn book-nav-prev"
            onClick={handlePrevPage}
            disabled={currentPage === 0 || flippingState !== null}
            title="Previous Page (Up Scroll / Left Arrow)"
            aria-label="Previous Page"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Side Navigation Arrow: Next Page */}
          <button
            type="button"
            className="book-nav-btn book-nav-next"
            onClick={handleNextPage}
            disabled={currentPage === totalBookPages - 1 || flippingState !== null}
            title="Next Page (Down Scroll / Right Arrow)"
            aria-label="Next Page"
          >
            <ChevronRight size={24} />
          </button>

          {/* Book Open Double Page Spread */}
          <div className="real-book-spread">
            {/* Left Static Page (English Edition) */}
            <div className="real-book-page page-left">
              {leftPageContent}
              {flippingState?.direction === 'next' && (
                <div className="page-under-shadow shadow-left" />
              )}
            </div>

            {/* 3D Center Spine Groove */}
            <div className="real-book-spine" />

            {/* Right Static Page (Gujarati Edition) */}
            <div className="real-book-page page-right">
              {rightPageContent}
              {flippingState?.direction === 'prev' && (
                <div className="page-under-shadow shadow-right" />
              )}
            </div>

            {/* ============================================================ */}
            {/* THE TURNING 3D PAGE LEAF (REAL MECHANICAL FLIP ANIMATION)     */}
            {/* ============================================================ */}
            {flippingState?.direction === 'next' && (
              <div className="flipping-leaf flip-forward">
                {/* Front face of flipping page: shows CURRENT right page lifting up */}
                <div className="flipping-face front-forward">
                  {renderRightPage(flippingState.from)}
                </div>

                {/* Back face of flipping page: shows INCOMING left page landing on left */}
                <div className="flipping-face back-forward">
                  {renderLeftPage(flippingState.to)}
                </div>
              </div>
            )}

            {flippingState?.direction === 'prev' && (
              <div className="flipping-leaf flip-backward">
                {/* Front face of flipping page: shows CURRENT left page lifting up */}
                <div className="flipping-face front-backward">
                  {renderLeftPage(flippingState.from)}
                </div>

                {/* Back face of flipping page: shows INCOMING right page landing on right */}
                <div className="flipping-face back-backward">
                  {renderRightPage(flippingState.to)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Rule Content Sub-Component
 */
const RuleContentBox = ({
  lang,
  title,
  subtitle,
  applicability,
  holdingPeriod,
  taxRate,
  exemption,
  calculationFormula,
  example,
  keyTakeaways
}) => {
  const isGu = lang === 'gu';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderLeft: isGu ? '3px solid #E5A93C' : '3px solid #1E3A8A',
        paddingLeft: '12px'
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: isGu ? '#B45309' : '#1E40AF',
            marginBottom: '2px'
          }}
        >
          {isGu ? 'ગુજરાતી આવૃત્તિ' : 'English Edition'}
        </div>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--color-navy-dark)',
            margin: '0 0 2px 0',
            lineHeight: 1.3
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '11.5px',
            color: 'var(--color-text-secondary)',
            margin: 0
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Grid of Key Properties with Claymorphic Chips */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '8px'
        }}
      >
        <div className="clay-metric-chip">
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
            {isGu ? 'હોલ્ડિંગ સમયગાળો' : 'Holding Period'}
          </span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-navy-dark)', marginTop: '1px' }}>
            {holdingPeriod}
          </div>
        </div>

        <div className="clay-metric-chip">
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
            {isGu ? 'ટેક્સ દર' : 'Applicable Tax Rate'}
          </span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#065F46', marginTop: '1px' }}>
            {taxRate}
          </div>
        </div>

        <div className="clay-metric-chip" style={{ gridColumn: '1 / -1' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
            {isGu ? 'મુક્તિ / છૂટછાટ' : 'Exemption Limit'}
          </span>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '1px' }}>
            {exemption}
          </div>
        </div>
      </div>

      {/* Applicability */}
      <div>
        <h4 style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-navy-dark)', margin: '0 0 2px 0' }}>
          {isGu ? 'ક્યારે અને કોને લાગુ પડે છે:' : 'Applicability & Conditions:'}
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--color-text-main)', lineHeight: 1.45, margin: 0 }}>
          {applicability}
        </p>
      </div>

      {/* Calculation Formula */}
      <div>
        <h4 style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-navy-dark)', margin: '0 0 2px 0' }}>
          {isGu ? 'ગણતરીનું સૂત્ર:' : 'Calculation Formula:'}
        </h4>
        <div className="clay-formula-box">
          {calculationFormula}
        </div>
      </div>

      {/* Real-World Example Box with Clay Bevel */}
      <div className="clay-example-box">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#1D4ED8',
            marginBottom: '2px'
          }}
        >
          <TrendingUp size={12} />
          {isGu ? 'વાસ્તવિક ગણતરીનું ઉદાહરણ:' : 'Real-World Calculation Example:'}
        </div>
        <p style={{ fontSize: '11px', color: '#1E3A8A', lineHeight: 1.45, margin: 0 }}>
          {example}
        </p>
      </div>

      {/* Key Takeaways */}
      <div>
        <h4 style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-navy-dark)', margin: '0 0 3px 0' }}>
          {isGu ? 'મહત્વના મુદ્દાઓ (Key Takeaways):' : 'Key Statutory Takeaways:'}
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {keyTakeaways.map((item, i) => (
            <li key={i} style={{ fontSize: '11px', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
