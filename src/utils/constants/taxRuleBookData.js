/**
 * Comprehensive Indian Capital Gains Tax Rule Book Data
 * Bilingual: English and Gujarati (ગુજરાતી)
 * Updated as per Finance (No. 2) Act, 2024 (Budget 2024) and current Income Tax Act, 1961 provisions.
 */

export const TAX_RULE_CATEGORIES = [
  { id: 'all', en: 'All Rules', gu: 'બધા નિયમો' },
  { id: 'stcg', en: 'Short-Term (STCG)', gu: 'શોર્ટ-ટર્મ (STCG)' },
  { id: 'ltcg', en: 'Long-Term (LTCG)', gu: 'લોંગ-ટર્મ (LTCG)' },
  { id: 'loss', en: 'Loss Set-Off & Carry Forward', gu: 'નુકસાન સરભર અને કેરી ફોરવર્ડ' },
  { id: 'fifo', en: 'FIFO Method', gu: 'FIFO પદ્ધતિ' },
  { id: 'corporate', en: 'Bonus, Splits & Gifts', gu: 'બોનસ, સ્પ્લિટ અને ગિફ્ટ' },
  { id: 'ipo', en: 'IPO Allotments', gu: 'IPO એલોટમેન્ટ' },
  { id: 'expenses', en: 'STT & Deductions', gu: 'STT અને ખર્ચ કપાત' },
  { id: 'compliance', en: 'Cess, Surcharge & Deadlines', gu: 'સેસ, સરચાર્જ અને તારીખો' }
];

export const TAX_RULES_DATA = [
  {
    id: 'sec-111a',
    category: 'stcg',
    section: 'Section 111A',
    badge: 'Budget 2024 Updated',
    badgeType: 'warning',
    en: {
      title: 'Short-Term Capital Gains (STCG) on Listed Equity',
      subtitle: 'Tax on shares sold within 12 months (365 days) from acquisition',
      applicability: 'Applies to listed equity shares, equity-oriented mutual funds, and units of business trusts sold on a recognized stock exchange (NSE/BSE) where Securities Transaction Tax (STT) has been paid.',
      holdingPeriod: '12 Months (365 days) or less from the date of purchase/allotment.',
      taxRate: '20% Flat (Increased from 15% effective 23rd July 2024 under Budget 2024) + 4% Health & Education Cess = Effective 20.80%.',
      exemption: 'No basic exemption limit for STCG directly; however, resident individuals can adjust unexhausted basic income tax slab exemption (₹2.5L / ₹3L) against STCG.',
      calculationFormula: 'Net Realized Profit = Net Selling Value (after brokerage & charges, excluding STT) - Total Acquisition Cost. STCG Tax = Net Profit × 20% (+ 4% Cess).',
      example: 'You purchased 100 shares of Reliance at ₹2,500 on 10-Aug-2025 (Total: ₹2,50,000). You sold all 100 shares at ₹2,900 on 15-Dec-2025 (Holding: ~4 months). Gross Profit = ₹40,000. Brokerage/charges = ₹500. Net STCG = ₹39,500. Tax at 20% = ₹7,900 + 4% Cess (₹316) = Total Tax ₹8,216.',
      keyTakeaways: [
        'Flat rate of 20% applies irrespective of your total income slab.',
        'STT must be paid at the time of sale.',
        'STCG loss can be adjusted against both STCG and LTCG.'
      ]
    },
    gu: {
      title: 'લિસ્ટેડ શેર્સ પર શોર્ટ-ટર્મ કેપિટલ ગેઇન્સ (STCG)',
      subtitle: 'ખરીદીની તારીખથી ૧૨ મહિના (૩૬૫ દિવસ) ની અંદર વેચાયેલા શેર પર લાગુ પડતો કર',
      applicability: 'માન્યતા પ્રાપ્ત સ્ટોક એક્સચેન્જ (NSE/BSE) પર STT ચૂકવીને ખરીદ-વેચાણ કરેલા તમામ લિસ્ટેડ ઇક્વિટી શેર અને ઇક્વિટી મ્યુચ્યુઅલ ફંડ પર લાગુ પડે છે.',
      holdingPeriod: 'ખરીદી અથવા એલોટમેન્ટ તારીખથી ૧૨ મહિના (૩૬૫ દિવસ) કે તેથી ઓછો સમયગાળો.',
      taxRate: '૨૦% ફ્લેટ (બજેટ ૨૦૨૪ થી ૧૫% થી વધારીને ૨૦% કરવામાં આવ્યો છે) + ૪% સેસ = અસરકારક ૨૦.૮૦% ટેક્સ.',
      exemption: 'STCG માટે કોઈ અલગ મુક્તિ મર્યાદા નથી; જોકે નિવાસી ભારતીય પોતાની મૂળ આવકવેરા મુક્તિ મર્યાદા (₹2.5L / ₹3L) સામે બાકી રકમ એડજસ્ટ કરી શકે છે.',
      calculationFormula: 'ચોખ્ખો નફો = વેચાણ ઉપજ (બ્રોકરેજ/ચાર્જ બાદ, STT સિવાય) - મૂળ ખરીદ કિંમત. ટેક્સ = ચોખ્ખો નફો × ૨૦% (+ ૪% સેસ).',
      example: 'તમે ૧૦-ઓગસ્ટ-૨૦૨૫ ના રોજ રિલાયન્સના ૧૦૦ શેર ₹૨,૫૦૦ માં ખરીદ્યા (કુલ ₹૨,૫૦,૦૦૦). ૧૫-ડિસેમ્બર-૨૦૨૫ ના રોજ તે શેર ₹૨,૯૦૦ ના ભાવે વેચ્યા (૪ મહિનામાં). કુલ નફો = ₹૪૦,૦૦૦. બ્રોકરેજ/ચાર્જ = ₹૫૦૦ બાદ કરતાં ચોખ્ખો નફો = ₹૩૯,૫૦૦. ૨૦% લેખે ટેક્સ = ₹૭,૯૦૦ + ૪% સેસ (₹૩૧૬) = કુલ કરપાત્ર રકમ ₹૮,૨૧૬.',
      keyTakeaways: [
        'તમારો આવકનો સ્લેબ ગમે તે હોય, આ નફા પર ફ્લેટ ૨૦% ટેક્સ લાગશે.',
        'વેચાણ સમયે STT કપાયેલ હોવો ફરજિયાત છે.',
        'STCG માં થયેલું નુકસાન STCG અને LTCG બંને સામે સરભર (Set-off) થઈ શકે છે.'
      ]
    }
  },
  {
    id: 'sec-112a',
    category: 'ltcg',
    section: 'Section 112A',
    badge: 'Budget 2024 Updated',
    badgeType: 'success',
    en: {
      title: 'Long-Term Capital Gains (LTCG) on Listed Equity',
      subtitle: 'Tax on shares held for more than 12 months (365 days)',
      applicability: 'Applies to sale of listed equity shares and equity mutual funds held for more than 12 months, where STT is paid at purchase and sale.',
      holdingPeriod: 'Strictly greater than 12 months (> 365 days) from acquisition date.',
      taxRate: '12.5% Flat on gains exceeding ₹1,25,000 per financial year (increased from 10% on gains > ₹1 Lakh effective 23rd July 2024) + 4% Cess = Effective 13.00%.',
      exemption: '₹1,25,000 per financial year across all LTCG from listed equity & equity funds is 100% TAX-FREE.',
      calculationFormula: 'Total LTCG = Sum of gains across all lots held > 365 days. Taxable LTCG = Total LTCG - ₹1,25,000 (if positive). Tax = Taxable LTCG × 12.5% (+ 4% Cess).',
      example: 'You held TCS shares bought in March 2024 at ₹3,200 and sold them in August 2025 at ₹4,400 (Holding: 17 months). Your total long-term profit across the financial year is ₹2,00,000. First ₹1,25,000 is 100% EXEMPT. Taxable Gain = ₹2,00,000 - ₹1,25,000 = ₹75,000. Tax at 12.5% = ₹9,375 + 4% Cess (₹375) = Total Tax ₹9,750.',
      keyTakeaways: [
        'Annual exemption threshold is ₹1,25,000 (combined for all equity LTCG).',
        'No indexation benefit is available for listed equity shares under Section 112A.',
        'Grandfathering relief applies to shares acquired before 31st January 2018.'
      ]
    },
    gu: {
      title: 'લિસ્ટેડ શેર્સ પર લોંગ-ટર્મ કેપિટલ ગેઇન્સ (LTCG)',
      subtitle: '૧૨ મહિના (૩૬૫ દિવસ) થી વધુ સમય રાખેલા શેર પર લાગુ પડતો કર',
      applicability: 'માન્યતા પ્રાપ્ત સ્ટોક એક્સચેન્જ પર ખરીદેલા અને ૧ વર્ષથી વધુ સમય હોલ્ડ કરી STT સાથે વેચેલા તમામ લિસ્ટેડ શેર્સ પર લાગુ પડે છે.',
      holdingPeriod: 'ખરીદી તારીખથી ૧૨ મહિનાથી વધુ સમયગાળો (> ૩૬૫ દિવસ).',
      taxRate: 'વાર્ષિક ₹૧,૨૫,૦૦૦ થી વધુ નફા પર ૧૨.૫% ફ્લેટ ટેક્સ (બજેટ ૨૦૨૪ થી ૧૦% થી વધારીને ૧૨.૫% અને મુક્તિ મર્યાદા ₹૧ લાખથી વધારીને ₹૧.૨૫ લાખ કરવામાં આવી છે) + ૪% સેસ = અસરકારક ૧૩.૦૦% ટેક્સ.',
      exemption: 'દરેક નાણાકીય વર્ષમાં કુલ ₹૧,૨૫,૦૦૦ સુધીનો લોંગ-ટર્મ નફો સંપૂર્ણપણે કરમુક્ત (Tax-Free) છે.',
      calculationFormula: 'કુલ LTCG નફો = ૩૬૫ દિવસથી વધુ રાખેલા શેરનો નફો. કરપાત્ર રકમ = કુલ LTCG - ₹૧,૨૫,૦૦૦. ટેક્સ = કરપાત્ર રકમ × ૧૨.૫% (+ ૪% સેસ).',
      example: 'તમે માર્ચ ૨૦૨૪ માં TCS ના શેર ખરીદ્યા અને ઓગસ્ટ ૨૦૨૫ માં વેચ્યા (૧૭ મહિના હોલ્ડ કર્યા). તમને આ વર્ષમાં કુલ ₹૨,૦૦,૦૦૦ નો લોંગ-ટર્મ નફો થયો. પ્રથમ ₹૧,૨૫,૦૦૦ સંપૂર્ણ કરમુક્ત રહેશે. બાકી વધેલા ₹૭૫,૦૦૦ પર ૧૨.૫% લેખે ₹૯,૩૭૫ + ૪% સેસ (₹૩૭૫) = કુલ ₹૯,૭૫૦ ટેક્સ ભરવો પડશે.',
      keyTakeaways: [
        'વાર્ષિક ₹૧,૨૫,૦૦૦ સુધીનો નફો તદ્દન કરમુક્ત છે.',
        'લિસ્ટેડ શેર પર ઇન્ડેક્સેશન (Indexation) નો લાભ મળતો નથી.',
        '૩૧ જાન્યુઆરી ૨૦૧૮ પહેલા ખરીદેલા શેર માટે ગ્રાન્ડફાધરિંગ (Grandfathering) કિંમતનો લાભ મળે છે.'
      ]
    }
  },
  {
    id: 'sec-70-74',
    category: 'loss',
    section: 'Sections 70, 71 & 74',
    badge: 'Critical Rule',
    badgeType: 'info',
    en: {
      title: 'Capital Loss Set-Off & Carry Forward Rules',
      subtitle: 'Strict rules governing how stock losses offset profits and carry forward for 8 years',
      applicability: 'Governs all capital losses realized from sale of equities, mutual funds, or securities.',
      holdingPeriod: 'Short-Term Capital Loss (STCL $\\le$ 12 mo) vs Long-Term Capital Loss (LTCL > 12 mo).',
      taxRate: 'N/A (Offset mechanism to reduce taxable gain).',
      exemption: 'Unabsorbed losses can be carried forward for up to 8 Assessment Years.',
      calculationFormula: '1. STCL can be set off against BOTH STCG and LTCG. 2. LTCL can ONLY be set off against LTCG (NEVER against STCG). 3. Capital losses cannot offset salary, house property, or business income (Sec 71).',
      example: 'Scenario A: You have ₹50,000 STCL (loss) and ₹80,000 LTCG (profit). Your STCL offsets LTCG, leaving ₹30,000 LTCG (well below ₹1.25L exemption, so ₹0 tax!). Scenario B: You have ₹60,000 LTCL and ₹50,000 STCG. You CANNOT set off LTCL against STCG. You must pay 20% on ₹50,000 STCG, and carry forward the ₹60,000 LTCL to future years.',
      keyTakeaways: [
        'Golden Rule: STCL can kill any capital gain (STCG or LTCG). LTCL can only kill LTCG.',
        'To carry forward losses for 8 years, you MUST file your ITR on or before the due date under Section 139(1) (usually 31st July).',
        'Losses from intraday trading are speculative business losses and cannot offset investment capital gains.'
      ]
    },
    gu: {
      title: 'શેરબજારમાં નુકસાન સરભર (Set-Off) અને આગળ ખેંચવા (Carry Forward) ના નિયમો',
      subtitle: 'નુકસાન સામે નફો બાદ કરવાના અને ૮ વર્ષ સુધી નુકસાન આગળ લઈ જવાના કાનૂની નિયમો',
      applicability: 'શેરબજારમાં શેર્સ અથવા મ્યુચ્યુઅલ ફંડ વેચતી વખતે થયેલા તમામ શોર્ટ-ટર્મ અને લોંગ-ટર્મ નુકસાન પર લાગુ પડે છે.',
      holdingPeriod: 'શોર્ટ-ટર્મ નુકસાન (STCL $\\le$ ૧૨ મહિના) અને લોંગ-ટર્મ નુકસાન (LTCL > ૧૨ મહિના).',
      taxRate: 'લાગુ પડતું નથી (નફો ઘટાડવા માટેની પદ્ધતિ).',
      exemption: 'સરભર ન થયેલું નુકસાન આગામી ૮ આકારણી વર્ષ (Assessment Years) સુધી આગળ ખેંચી શકાય છે.',
      calculationFormula: '૧. શોર્ટ-ટર્મ નુકસાન (STCL) એ STCG અને LTCG બંને પ્રકારના નફા સામે બાદ મળે છે. ૨. લોંગ-ટર્મ નુકસાન (LTCL) માત્ર ને માત્ર LTCG સામે જ બાદ મળે (ક્યારેય STCG સામે બાદ ન મળે). ૩. શેરબજારનું નુકસાન પગાર કે અન્ય આવક સામે બાદ મળતું નથી.',
      example: 'ઉદાહરણ ૧: તમને ₹૫૦,૦૦૦ નું શોર્ટ-ટર્મ નુકસાન (STCL) થયું અને ₹૮૦,૦૦૦ નો લોંગ-ટર્મ નફો (LTCG) થયો. શોર્ટ-ટર્મ નુકસાન બાદ થતાં ચોખ્ખો નફો ₹૩૦,૦૦૦ રહે (જે ₹૧.૨૫ લાખની મુક્તિ મર્યાદાથી ઓછો હોવાથી ₹૦ ટેક્સ થશે!). ઉદાહરણ ૨: તમને ₹૬૦,૦૦૦ નું લોંગ-ટર્મ નુકસાન અને ₹૫૦,૦૦૦ નો શોર્ટ-ટર્મ નફો થયો. લોંગ-ટર્મ નુકસાન શોર્ટ-ટર્મ નફા સામે બાદ નહિ મળે, તેથી ₹૫૦,૦૦૦ પર ૨૦% ટેક્સ ભરવો પડશે અને ₹૬૦,૦૦૦ નુકસાન આગળના વર્ષો માટે કેરી ફોરવર્ડ થશે.',
      keyTakeaways: [
        'સુવર્ણ નિયમ: STCL કોઈપણ કેપિટલ ગેઈન (STCG કે LTCG) સામે બાદ મળે છે. પરંતુ LTCL ફક્ત LTCG સામે જ બાદ મળે છે.',
        'નુકસાનને ૮ વર્ષ સુધી આગળ ખેંચવા માટે કલમ 139(1) મુજબ નિયત તારીખ (૩૧ જુલાઈ) પહેલા ITR ફાઈલ કરવું ફરજિયાત છે.',
        'ઈન્ટ્રાડે ટ્રેડિંગનું નુકસાન સ્પેક્યુલેટીવ બિઝનેસ લોસ ગણાય છે, જે ઇન્વેસ્ટમેન્ટ કેપિટલ ગેઇન્સ સામે સેટ-ઓફ થતું નથી.'
      ]
    }
  },
  {
    id: 'fifo-method',
    category: 'fifo',
    section: 'Section 45 & CBDT Circular',
    badge: 'Mandatory Accounting',
    badgeType: 'primary',
    en: {
      title: 'FIFO (First-In, First-Out) Accounting Method',
      subtitle: 'The only legally accepted method in India to match stock purchases with sales',
      applicability: 'Mandatory under Indian Income Tax law for determining cost of acquisition and holding period when multiple lots of the same stock are held.',
      holdingPeriod: 'Determined lot-by-lot based on the exact purchase date of the oldest available shares.',
      taxRate: 'Determines whether each individual lot sold is taxed under STCG (20%) or LTCG (12.5%).',
      exemption: 'N/A.',
      calculationFormula: 'When you sell shares, the shares bought earliest in time are deemed to be sold first. Average cost method is strictly INVALID for Indian income tax calculations.',
      example: 'Lot 1: Bought 50 shares at ₹100 on 01-Jan-2024. Lot 2: Bought 50 shares at ₹150 on 01-Nov-2024. Sale: Sold 60 shares at ₹200 on 15-Feb-2025. Accounting matches: First 50 shares taken from Lot 1 (Held > 12 mo $\\rightarrow$ LTCG: 50 × ₹100 = ₹5,000 profit). Remaining 10 shares taken from Lot 2 (Held 3.5 mo $\\rightarrow$ STCG: 10 × ₹50 = ₹500 profit).',
      keyTakeaways: [
        'NetNafa engine strictly runs automated FIFO lot allocation.',
        'You cannot choose which specific lot to sell for tax advantage; the law enforces earliest purchase date first.',
        'Each matched lot generates its own capital gain classification.'
      ]
    },
    gu: {
      title: 'પ્રથમ આવે તે પ્રથમ જાય (FIFO - First-In, First-Out) પદ્ધતિ',
      subtitle: 'શેરબજારમાં ખરીદ-વેચાણ મેચ કરવા માટે ભારતીય આવકવેરા કાયદા માન્ય એકમાત્ર પદ્ધતિ',
      applicability: 'જ્યારે તમે એક જ કંપનીના શેર અલગ અલગ સમયે ખરીદ્યા હોય અને તેમાંથી અમુક શેર વેચો, ત્યારે કયો શેર વેચાયો તે નક્કી કરવા FIFO પદ્ધતિ ફરજિયાત છે.',
      holdingPeriod: 'દરેક લોટની ખરીદી તારીખથી વેચાણ તારીખ સુધીનો સમયગાળો વ્યક્તિગત રીતે ગણાય છે.',
      taxRate: 'દરેક લોટ શોર્ટ-ટર્મ (૨૦%) કે લોંગ-ટર્મ (૧૨.૫%) છે તે નક્કી કરે છે.',
      exemption: 'લાગુ પડતું નથી.',
      calculationFormula: 'જે શેર તમે સૌથી પહેલા ખરીદ્યા હતા, વેચાણ વખતે તે શેર સૌથી પહેલા વેચાયા ગણાય છે. સરેરાશ કિંમત (Average Price) થી ટેક્સ ગણવો કાયદેસર રીતે અમાન્ય છે.',
      example: 'લોટ ૧: ૦૧-જાન્યુ-૨૦૨૪ ના રોજ ૫૦ શેર ₹૧૦૦ માં ખરીદ્યા. લોટ ૨: ૦૧-નવે-૨૦૨૪ ના રોજ ૫૦ શેર ₹૧૫૦ માં ખરીદ્યા. વેચાણ: ૧૫-ફેબ્રુ-૨૦૨૫ ના રોજ ૬૦ શેર ₹૨૦૦ ના ભાવે વેચ્યા. FIFO મુજબ ગણતરી: પ્રથમ ૫૦ શેર લોટ ૧ માંથી વેચાયા (૧૨ મહિનાથી વધુ હોવાથી LTCG નફો = ૫૦ × ₹૧૦૦ = ₹૫,૦૦૦). બાકીના ૧૦ શેર લોટ ૨ માંથી વેચાયા (૩.૫ મહિના હોવાથી STCG નફો = ૧૦ × ₹૫૦ = ₹૫૦૦).',
      keyTakeaways: [
        'NetNafa એપ્લિકેશન તમારા તમામ વ્યવહારોમાં આપમેળે ૧૦૦% સચોટ FIFO પદ્ધતિ લાગુ કરે છે.',
        'તમે તમારી મરજી મુજબ કોઈ ચોક્કસ લોટ વેચવાનું પસંદ કરી શકતા નથી; કાયદો સૌથી જૂના શેર પહેલા ગણે છે.',
        'દરેક લોટનો નફો અને હોલ્ડિંગ પિરિયડ અલગ-અલગ ગણવામાં આવે છે.'
      ]
    }
  },
  {
    id: 'bonus-splits',
    category: 'corporate',
    section: 'Section 55(2)(aa)',
    badge: 'Corporate Actions',
    badgeType: 'secondary',
    en: {
      title: 'Bonus Shares & Stock Splits Taxation Rules',
      subtitle: 'Cost of acquisition and holding period calculation for corporate actions',
      applicability: 'All bonus shares and stock split allotments received by an investor.',
      holdingPeriod: 'Bonus: Starts strictly from the date of allotment of bonus shares. Splits: Retains the original purchase date of the parent shares.',
      taxRate: 'STCG (20%) or LTCG (12.5%) depending on holding period from applicable date.',
      exemption: 'Receipt of bonus or split shares is not a taxable event. Tax is triggered only upon sale.',
      calculationFormula: 'Bonus Cost of Acquisition = ₹0 (NIL). Split Cost of Acquisition = Original Cost divided proportionally by split ratio (e.g. 1:5 split reduces per share cost to 1/5th).',
      example: 'Bonus Example: You hold 100 shares bought at ₹500. Company gives 1:1 bonus (100 bonus shares at ₹0 cost). If you sell 100 bonus shares after 6 months at ₹300, entire ₹30,000 (100 × ₹300 - ₹0) is STCG taxed at 20%. Split Example: You bought 10 shares at ₹1,000 (Total ₹10,000). Stock splits 1:10 (you now have 100 shares at ₹100 each). Holding period still dates back to original purchase date.',
      keyTakeaways: [
        'Cost of bonus shares is always taken as ₹0 (zero).',
        'Bonus share holding period starts on allotment date, NOT parent share date.',
        'Stock split preserves the original purchase date and lowers average cost per share proportionally.'
      ]
    },
    gu: {
      title: 'બોનસ શેર્સ અને સ્ટોક સ્પ્લિટ (Stock Split) ના ટેક્સ નિયમો',
      subtitle: 'કોર્પોરેટ એક્શન વખતે ખરીદ કિંમત અને હોલ્ડિંગ સમયગાળો ગણવાના નિયમો',
      applicability: 'કંપની દ્વારા ફાળવવામાં આવતા તમામ બોનસ શેર અને સ્ટોક સ્પ્લિટ પર લાગુ પડે છે.',
      holdingPeriod: 'બોનસ શેર: એલોટમેન્ટ (જમા થયા) ની તારીખથી સમય ગણાય છે. સ્ટોક સ્પ્લિટ: મૂળ ખરીદીની તારીખથી જ હોલ્ડિંગ સમય ચાલુ રહે છે.',
      taxRate: 'હોલ્ડિંગ સમય મુજબ શોર્ટ-ટર્મ (૨૦%) અથવા લોંગ-ટર્મ (૧૨.૫%).',
      exemption: 'બોનસ કે સ્પ્લિટ મળતી વખતે કોઈ ટેક્સ લાગતો નથી. જ્યારે તમે તેને વેચો ત્યારે જ ટેક્સ લાગે છે.',
      calculationFormula: 'બોનસ શેરની ખરીદ કિંમત = ₹૦ (શૂન્ય) ગણાય છે. સ્ટોક સ્પ્લિટમાં મૂળ ખરીદ કિંમત શેરના ગુણોત્તર મુજબ વહેંચાઈ જાય છે.',
      example: 'બોનસ ઉદાહરણ: તમારી પાસે ₹૫૦૦ માં ખરીદેલા ૧૦૦ શેર છે. કંપની ૧:૧ બોનસ આપે છે (૧૦૦ નવા બોનસ શેર ₹૦ કિંમતે મળ્યા). જો તમે આ ૧૦૦ બોનસ શેર ૬ મહિના પછી ₹૩૦૦ ના ભાવે વેચો, તો પૂરેપૂરા ₹૩૦,૦૦૦ (૧૦૦ × ₹૩૦૦ - ₹૦) પર શોર્ટ-ટર્મ ગેઇન (૨૦%) ટેક્સ લાગશે. સ્પ્લિટ ઉદાહરણ: ₹૧,૦૦૦ ના ભાવે ૧૦ શેર ખરીદ્યા હતા. ૧:૧૦ સ્પ્લિટ થતાં હવે ૧૦૦ શેર થયા અને દરેકની ખરીદ કિંમત ₹૧૦૦ થઈ ગઈ, પરંતુ ખરીદીની તારીખ મૂળ તારીખ જ રહેશે.',
      keyTakeaways: [
        'બોનસ શેરની પડતર કિંમત હંમેશા ₹૦ (શૂન્ય) માનવામાં આવે છે.',
        'બોનસ શેરનો હોલ્ડિંગ સમયગાળો મૂળ શેરની તારીખથી નહિ, પરંતુ બોનસ જમા થયાની તારીખથી ગણાય છે.',
        'સ્ટોક સ્પ્લિટમાં ખરીદીની મૂળ તારીખ યથાવત રહે છે.'
      ]
    }
  },
  {
    id: 'gifts-inheritance',
    category: 'corporate',
    section: 'Section 49(1) & Section 56(2)(x)',
    badge: 'Family & Succession',
    badgeType: 'info',
    en: {
      title: 'Gifted & Inherited Shares Taxation',
      subtitle: 'Cost of acquisition and holding period rules for gifts from relatives vs non-relatives',
      applicability: 'Applies when shares are transferred as gift (off-market) or received through inheritance/will.',
      holdingPeriod: 'Holding period includes the time the previous owner (donor) held the shares.',
      taxRate: 'At receipt: EXEMPT if received from specified relative or under will. At sale: Normal STCG (20%) or LTCG (12.5%).',
      exemption: 'Gifts from defined relatives (spouse, siblings, parents, lineal ascendants/descendants) are 100% tax-free under Sec 56(2)(x).',
      calculationFormula: 'Cost of Acquisition = The actual purchase price paid by the previous owner who acquired them by purchase. Total Holding Period = Donor\'s Holding Period + Donee\'s Holding Period.',
      example: 'Your father bought 100 shares of Infosys at ₹400 in 2020. He gifted them to you in January 2025. You sold them in May 2025 for ₹1,800. Even though you only held them for 4 months, your holding period includes your father\'s holding (2020 to 2025 = > 12 months $\\rightarrow$ LTCG!). Acquisition cost is ₹400 (father\'s purchase price). Capital gain = 100 × (₹1,800 - ₹400) = ₹1,40,000 (taxed under Sec 112A at 12.5% above ₹1.25L).',
      keyTakeaways: [
        'Gifts between specified blood relatives carry zero tax at the time of transfer.',
        'The recipient steps into the shoes of the original buyer for both Cost and Holding Duration.',
        'Gifts from non-relatives exceeding ₹50,000 in fair market value are taxable in the recipient\'s hands under Income from Other Sources.'
      ]
    },
    gu: {
      title: 'ભેટ (Gift) અથવા વારસામાં મળેલા શેર પર ટેક્સ નિયમો',
      subtitle: 'સગા-સંબંધીઓ તરફથી ભેટમાં મળેલા શેરની ખરીદ કિંમત અને હોલ્ડિંગ પિરિયડની ગણતરી',
      applicability: 'વારસામાં, વસિયતનામા દ્વારા કે સગાં-સંબંધીઓ તરફથી ભેટ (Off-market transfer) માં મળેલા શેર પર લાગુ પડે છે.',
      holdingPeriod: 'મૂળ દાતા (જેમણે શેર ખરીદ્યા હતા) ના હોલ્ડિંગ સમયને પણ તમારા હોલ્ડિંગ સમયમાં ઉમેરવામાં આવે છે.',
      taxRate: 'મળતી વખતે: સગાં પાસેથી મળે તો ₹૦ ટેક્સ. વેચતી વખતે: સામાન્ય STCG (૨૦%) કે LTCG (૧૨.૫%).',
      exemption: 'કલમ 56(2)(x) મુજબ નિર્ધારિત સગાં (માતા-પિતા, પત્ની, ભાઈ-બહેન, બાળકો) પાસેથી મળેલી ભેટ સંપૂર્ણ કરમુક્ત છે.',
      calculationFormula: 'ખરીદ કિંમત = મૂળ ખરીદનાર (દાતા) એ ચૂકવેલી મૂળ કિંમત માન્ય ગણાય. કુલ હોલ્ડિંગ સમય = દાતાનો સમય + તમારો સમય.',
      example: 'તમારા પિતાજીએ ૨૦૨૦ માં ઈન્ફોસિસના ૧૦૦ શેર ₹૪૦૦ માં ખરીદ્યા હતા. તેમણે જાન્યુઆરી ૨૦૨૫ માં તમને ભેટ આપ્યા. તમે મે ૨૦૨૫ માં ₹૧,૮૦૦ ના ભાવે વેચ્યા. તમે માત્ર ૪ મહિના રાખ્યા હોવા છતાં, પિતાજીનો ૨૦૨૦ થી ૨૦૨૫ નો સમય ઉમેરાતા આ લોંગ-ટર્મ (LTCG) ગણાશે! ખરીદ કિંમત પિતાજીની ₹૪૦૦ જ ગણાશે. નફો = ૧૦૦ × (₹૧,૮૦૦ - ₹૪૦૦) = ₹૧,૪૦,૦૦૦ (જેના પર ₹૧.૨૫ લાખ મુક્તિ બાદ વધેલા ₹૧૫,૦૦૦ પર ૧૨.૫% LTCG ટેક્સ લાગશે).',
      keyTakeaways: [
        'નજીકના સગાં-સંબંધીઓ વચ્ચે શેર્સની ભેટ પર ટ્રાન્સફર વખતે કોઈ ટેક્સ લાગતો નથી.',
        'વેચાણ વખતે મૂળ દાતાની ખરીદ તારીખ અને ખરીદ કિંમત જ માન્ય રહે છે.',
        'બિન-સંબંધીઓ તરફથી વર્ષમાં ₹૫૦,૦૦૦ થી વધુ કિંમતના મળેલા શેર પર અન્ય સ્ત્રોતની આવક તરીકે સ્લેબ મુજબ ટેક્સ લાગે છે.'
      ]
    }
  },
  {
    id: 'ipo-allotment',
    category: 'ipo',
    section: 'IPO Taxation & Listing Gain',
    badge: 'Primary Market',
    badgeType: 'primary',
    en: {
      title: 'IPO Allotment & Listing Gains Taxation',
      subtitle: 'Taxation of IPO applications, allotment dates, and listing day gains',
      applicability: 'All initial public offerings (mainboard and SME) applied and allotted to investors.',
      holdingPeriod: 'Holding period strictly starts from the date of ALLOTMENT (not the bid submission date).',
      taxRate: 'If sold on listing day or within 12 months: STCG at 20%. If held > 12 months: LTCG at 12.5% above ₹1.25L.',
      exemption: 'Listing gain shown on the demat statement is NOT taxable until the shares are actually sold.',
      calculationFormula: 'Cost = Issue Price per share × Allotted Quantity. Realized Gain = (Sale Price - Issue Price) × Quantity - Selling Charges (excluding STT).',
      example: 'You applied for ABC IPO at cut-off price ₹300 (Lot size: 50 shares = ₹15,000). Allotment date was 12-Sep-2025. Stock listed on 16-Sep-2025 at ₹480 (+60% listing gain). If you sell on listing day: Holding is 4 days $\\rightarrow$ STCG = 50 × (₹480 - ₹300) = ₹9,000 profit. Tax at 20% = ₹1,800 + 4% Cess (₹72) = ₹1,872.',
      keyTakeaways: [
        'Listing gains are treated as normal Short-Term Capital Gains (STCG) if sold immediately.',
        'Holding period commences on the official Demat Allotment date.',
        'If shares are not allotted and application money is unblocked/refunded, there are zero tax implications.'
      ]
    },
    gu: {
      title: 'IPO એલોટમેન્ટ અને લિસ્ટિંગ ગેઇન (Listing Gain) ના ટેક્સ નિયમો',
      subtitle: 'IPO એપ્લિકેશન, એલોટમેન્ટ તારીખ અને લિસ્ટિંગના દિવસે વેચાણ પર ટેક્સની ગણતરી',
      applicability: 'મેઈનબોર્ડ અને SME એક્સચેન્જ પર અરજી કરીને મેળવેલા તમામ IPO શેર્સ પર લાગુ પડે છે.',
      holdingPeriod: 'હોલ્ડિંગ સમયગાળો બિડિંગની તારીખથી નહિ, પરંતુ એલોટમેન્ટ (ડીમેટમાં શેર જમા) ની તારીખથી શરૂ થાય છે.',
      taxRate: 'જો લિસ્ટિંગના દિવસે કે ૧૨ મહિનામાં વેચો તો STCG ૨૦%. જો ૧૨ મહિનાથી વધુ રાખો તો LTCG ૧૨.૫% (₹૧.૨૫ લાખ મુક્તિ બાદ).',
      exemption: 'ડીમેટમાં દેખાતો નોશનલ લિસ્ટિંગ ગેઇન કરપાત્ર નથી; જ્યાં સુધી શેર વેચાય નહીં ત્યાં સુધી કોઈ ટેક્સ ભરવાનો રહેતો નથી.',
      calculationFormula: 'ખરીદ કિંમત = IPO ઈશ્યૂ પ્રાઈસ. રિયલાઈઝ્ડ નફો = (વેચાણ કિંમત - ઈશ્યૂ કિંમત) × જથ્થો - વેચાણ ખર્ચ (STT સિવાય).',
      example: 'તમે ABC કંપનીના IPO માં ₹૩૦૦ ના ભાવે ૧ લોટ (૫૦ શેર = ₹૧૫,૦૦૦) મેળવ્યો. એલોટમેન્ટ તારીખ ૧૨-સપ્ટે-૨૦૨૫ હતી. શેર ૧૬-સપ્ટે-૨૦૨૫ ના રોજ ₹૪૮૦ ના ભાવે ૬૦% પ્રીમિયમે લિસ્ટ થયો. જો તમે લિસ્ટિંગના દિવસે જ વેચી દો: હોલ્ડિંગ સમય ૪ દિવસ $\\rightarrow$ શોર્ટ-ટર્મ નફો = ૫૦ × (₹૪૮૦ - ₹૩૦૦) = ₹૯,૦૦૦. ૨૦% લેખે ટેક્સ = ₹૧,૮૦૦ + ૪% સેસ (₹૭૨) = કુલ ₹૧,૮૭૨ ટેક્સ થશે.',
      keyTakeaways: [
        'લિસ્ટિંગના દિવસે મળેલો નફો શોર્ટ-ટર્મ કેપિટલ ગેઇન્સ (STCG) ગણાય છે અને તેના પર ૨૦% ટેક્સ લાગે છે.',
        'હોલ્ડિંગ પિરિયડ ડીમેટમાં શેર એલોટ થયાની સત્તાવાર તારીખથી ગણાય છે.',
        'જો IPO ન લાગે અને રૂપિયા અનબ્લોક/રીફંડ થઈ જાય, તો તેના પર કોઈ ટેક્સ લાગતો નથી.'
      ]
    }
  },
  {
    id: 'stt-expenses',
    category: 'expenses',
    section: 'Section 40(a)(ib) & Section 48',
    badge: 'Expense Deductions',
    badgeType: 'warning',
    en: {
      title: 'Allowable Expenses vs. STT Non-Deductibility',
      subtitle: 'What charges can and cannot be deducted from your capital gains calculations',
      applicability: 'All equity transactions incurring brokerage, exchange charges, GST, stamp duty, and STT.',
      holdingPeriod: 'Applies equally to both STCG and LTCG transactions.',
      taxRate: 'N/A (Cost deduction rule).',
      exemption: 'Reduces taxable capital gains dollar-for-dollar for allowable expenses.',
      calculationFormula: 'Allowable: Brokerage + Exchange Transaction Charges + SEBI Turnover Fee + Stamp Duty + GST on Brokerage. STRICTLY DISALLOWED: Securities Transaction Tax (STT).',
      example: 'You sell shares for ₹5,00,000. Brokerage is ₹200, GST is ₹36, Stamp duty is ₹75, Exchange fee is ₹18, and STT is ₹500. Total allowable expenses = ₹329. You CANNOT deduct the ₹500 STT under Section 40(a)(ib). Net sale consideration = ₹5,00,000 - ₹329 = ₹4,99,671.',
      keyTakeaways: [
        'STT is strictly non-deductible as an expense for capital gains investors.',
        'All genuine transaction costs (brokerage, stamp duty, GST, exchange turnover) increase acquisition cost or reduce sale proceeds.',
        'NetNafa automatically segregates STT and ensures 100% tax compliance with CBDT guidelines.'
      ]
    },
    gu: {
      title: 'ખર્ચ કપાત અને STT બાદ ન મળવા અંગેનો કાયદો (Sec 40(a)(ib))',
      subtitle: 'શેરબજારમાં નફો ગણતી વખતે કયા ચાર્જિસ બાદ મળે છે અને કયા નથી મળતા તેની સ્પષ્ટતા',
      applicability: 'બ્રોકરેજ, એક્સચેન્જ ચાર્જ, GST, સ્ટેમ્પ ડ્યુટી અને STT ધરાવતા તમામ વ્યવહારો પર લાગુ પડે છે.',
      holdingPeriod: 'શોર્ટ-ટર્મ (STCG) અને લોંગ-ટર્મ (LTCG) બંને માટે સમાન નિયમ.',
      taxRate: 'લાગુ પડતું નથી (ખર્ચ બાદ કરવાની જોગવાઈ).',
      exemption: 'માન્ય ખર્ચાઓ તમારા કરપાત્ર નફામાંથી સીધા બાદ મળે છે.',
      calculationFormula: 'બાદ મળતા ખર્ચ: બ્રોકરેજ + એક્સચેન્જ ટ્રાન્ઝેક્શન ચાર્જ + સેબી ફી + સ્ટેમ્પ ડ્યુટી + બ્રોકરેજ પરનો GST. ક્યારેય બાદ ન મળતો ખર્ચ: સિક્યોરિટીઝ ટ્રાન્ઝેક્શન ટેક્સ (STT).',
      example: 'તમે ₹૫,૦૦,૦૦૦ ના શેર વેચ્યા. જેમાં બ્રોકરેજ ₹૨૦૦, GST ₹૩૬, સ્ટેમ્પ ડ્યુટી ₹૭૫, એક્સચેન્જ ફી ₹૧૮ અને STT ₹૫૦૦ છે. બાદ મળવાપાત્ર કુલ ખર્ચ = ₹૩૨૯. કલમ 40(a)(ib) મુજબ STT ના ₹૫૦૦ ક્યારેય બાદ મળતા નથી. ચોખ્ખી વેચાણ ઉપજ = ₹૫,૦૦,૦૦૦ - ₹૩૨૯ = ₹૪,૯૯,૬૭૧ ગણાશે.',
      keyTakeaways: [
        'ઇન્વેસ્ટર્સ માટે STT (સિક્યોરિટીઝ ટ્રાન્ઝેક્શન ટેક્સ) આવકવેરામાં ખર્ચ તરીકે ક્યારેય બાદ મળતો નથી.',
        'બ્રોકરેજ, સ્ટેમ્પ ડ્યુટી, એક્સચેન્જ ફી અને તેના પરનો GST નફામાંથી કાયદેસર બાદ મળે છે.',
        'NetNafa એપ્લિકેશન STT ને આપમેળે અલગ રાખી આવકવેરાના નિયમો મુજબ જ ચોખ્ખા નફાની ગણતરી કરે છે.'
      ]
    }
  },
  {
    id: 'cess-surcharge-deadlines',
    category: 'compliance',
    section: 'Cess, Surcharge & Section 139(1)',
    badge: 'Statutory Compliance',
    badgeType: 'danger',
    en: {
      title: 'Cess, Surcharge Caps & Tax Filing Deadlines',
      subtitle: 'Health & Education Cess, Surcharge ceiling for equity, and ITR filing due dates',
      applicability: 'All individual taxpayers reporting equity capital gains in India.',
      holdingPeriod: 'Applicable annually across total tax liability.',
      taxRate: '4% Health & Education Cess on total tax. Surcharge capped at maximum 15% for Section 111A and Section 112A.',
      exemption: 'No surcharge if total taxable income is below ₹50 Lakhs.',
      calculationFormula: 'Final Tax = (Base Tax + Surcharge) × 1.04 (4% Cess).',
      example: 'If your base STCG tax is ₹1,00,000 and total income is below ₹50 Lakhs (surcharge 0%): Final Tax = ₹1,00,000 + 4% Cess (₹4,000) = ₹1,04,000. Important Protection: Even for high net worth individuals earning over ₹5 Crores (where general surcharge is 39% or 25%), the surcharge on equity capital gains under 111A & 112A is legally capped at 15%.',
      keyTakeaways: [
        'Surcharge on equity capital gains is legally capped at 15% to protect equity investors.',
        '4% Health & Education cess is mandatory on all tax liabilities.',
        'Annual ITR filing due date is usually 31st July of the assessment year. Late filing forfeits loss carry-forward benefits.'
      ]
    },
    gu: {
      title: '૪% સેસ, સરચાર્જની ૧૫% મર્યાદા અને ITR ફાઈલિંગ ડેડલાઈન',
      subtitle: 'હેલ્થ એન્ડ એજ્યુકેશન સેસ, શેરબજાર પર સરચાર્જની વિશેષ છૂટ અને સમયસર રિટર્ન ભરવાના નિયમો',
      applicability: 'શેરબજારમાં કેપિટલ ગેઇન્સ ધરાવતા તમામ વ્યક્તિગત કરદાતાઓ પર લાગુ પડે છે.',
      holdingPeriod: 'નાણાકીય વર્ષ દરમિયાન કુલ ગણાયેલી ટેક્સ રકમ પર લાગુ પડે છે.',
      taxRate: 'કુલ ટેક્સ પર ૪% હેલ્થ એન્ડ એજ્યુકેશન સેસ. કલમ 111A અને 112A પર મહત્તમ સરચાર્જ ૧૫% સીમિત રાખવામાં આવ્યો છે.',
      exemption: 'જો વાર્ષિક કુલ આવક ₹૫૦ લાખથી ઓછી હોય તો સરચાર્જ ૦% (શૂન્ય) રહે છે.',
      calculationFormula: 'અંતિમ ટેક્સ = (મૂળ ટેક્સ + લાગુ પડતો સરચાર્જ) × ૧.૦૪ (૪% સેસ ઉમેરીને).',
      example: 'જો તમારો મૂળ STCG ટેક્સ ₹૧,૦૦,૦૦૦ થાય અને કુલ આવક ₹૫૦ લાખથી ઓછી હોય (સરચાર્જ ૦%): અંતિમ ટેક્સ = ₹૧,૦૦,૦૦૦ + ૪% સેસ (₹૪,૦૦૦) = ₹૧,૦૪,૦૦૦. મહત્વની રાહત: મોટા રોકાણકારો જેમની વાર્ષિક આવક ₹૫ કરોડથી વધુ હોય તેમનો સામાન્ય સરચાર્જ ૨૫% કે ૩૯% હોય છે, છતાં શેરબજારના નફા (111A/112A) પર સરચાર્જ કાયદા મુજબ વધુમાં વધુ ૧૫% થી વધી શકતો નથી.',
      keyTakeaways: [
        'શેરબજારના રોકાણકારોના રક્ષણ માટે સરચાર્જ વધુમાં વધુ ૧૫% જ લાગી શકે છે.',
        'ગણાયેલા કુલ ટેક્સ પર ૪% હેલ્થ એન્ડ એજ્યુકેશન સેસ ઉમેરવો ફરજિયાત છે.',
        'દર વર્ષે ૩૧ જુલાઈ પહેલાં ITR ફાઈલ કરવું જરૂરી છે; જો મોડું કરશો તો શેરબજારનું નુકસાન આગળના વર્ષોમાં કેરી ફોરવર્ડ કરવાનો અધિકાર ગુમાવી દેશો.'
      ]
    }
  }
];

export const TAX_CHEAT_SHEET = [
  {
    paramEn: 'STCG Tax Rate (Sec 111A)',
    paramGu: 'શોર્ટ-ટર્મ ટેક્સ દર (કલમ 111A)',
    budget2024: '20% + 4% Cess (Effective 20.80%)',
    preBudget: '15% + 4% Cess (15.60%)',
    holdingEn: 'Held ≤ 12 Months',
    holdingGu: '૧૨ મહિના કે તેથી ઓછો સમય'
  },
  {
    paramEn: 'LTCG Tax Rate (Sec 112A)',
    paramGu: 'લોંગ-ટર્મ ટેક્સ દર (કલમ 112A)',
    budget2024: '12.5% + 4% Cess (Effective 13.00%)',
    preBudget: '10% + 4% Cess (10.40%)',
    holdingEn: 'Held > 12 Months',
    holdingGu: '૧૨ મહિનાથી વધુ સમય'
  },
  {
    paramEn: 'LTCG Annual Exemption Limit',
    paramGu: 'વાર્ષિક LTCG કરમુક્તિ મર્યાદા',
    budget2024: '₹1,25,000 per financial year',
    preBudget: '₹1,00,000 per financial year',
    holdingEn: 'LTCG Only',
    holdingGu: 'માત્ર લોંગ-ટર્મ નફા માટે'
  },
  {
    paramEn: 'STCL (Short-Term Loss) Offset',
    paramGu: 'STCL નુકસાન સરભર નિયમ',
    budget2024: 'Against BOTH STCG and LTCG',
    preBudget: 'Against BOTH STCG and LTCG',
    holdingEn: 'Any capital gain',
    holdingGu: 'કોઈપણ કેપિટલ ગેઈન સામે'
  },
  {
    paramEn: 'LTCL (Long-Term Loss) Offset',
    paramGu: 'LTCL નુકસાન સરભર નિયમ',
    budget2024: 'ONLY against LTCG (Never STCG)',
    preBudget: 'ONLY against LTCG (Never STCG)',
    holdingEn: 'LTCG gains only',
    holdingGu: 'માત્ર લોંગ-ટર્મ નફા સામે'
  },
  {
    paramEn: 'Loss Carry Forward Period',
    paramGu: 'નુકસાન આગળ ખેંચવાની મર્યાદા',
    budget2024: '8 Assessment Years (ITR filed by due date)',
    preBudget: '8 Assessment Years (ITR filed by due date)',
    holdingEn: 'Up to 8 years',
    holdingGu: '૮ વર્ષ સુધી'
  },
  {
    paramEn: 'Accounting Method',
    paramGu: 'હિસાબ કરવાની પદ્ધતિ',
    budget2024: 'Strict FIFO (First-In, First-Out)',
    preBudget: 'Strict FIFO (First-In, First-Out)',
    holdingEn: 'Earliest purchase first',
    holdingGu: 'સૌથી જૂની ખરીદી પહેલા'
  },
  {
    paramEn: 'STT Deductibility',
    paramGu: 'STT ખર્ચ બાદ મળવા બાબત',
    budget2024: 'STRICTLY NOT DEDUCTIBLE',
    preBudget: 'STRICTLY NOT DEDUCTIBLE',
    holdingEn: 'Disallowed (Sec 40(a)(ib))',
    holdingGu: 'બાદ મળતો નથી'
  }
];
