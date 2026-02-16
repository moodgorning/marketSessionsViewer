// Public holidays for stock exchanges
// Format: YYYY-MM-DD (ISO format for easy comparison)
// This covers major holidays for 2024-2026

export const marketHolidays: Record<string, string[]> = {
  'America/New_York': [
    // US Holidays - NYSE, NASDAQ
    '2024-01-01', // New Year's Day
    '2024-01-15', // MLK Jr. Day
    '2024-02-19', // Presidents Day
    '2024-03-29', // Good Friday
    '2024-05-27', // Memorial Day
    '2024-06-19', // Juneteenth
    '2024-07-04', // Independence Day
    '2024-09-02', // Labor Day
    '2024-11-28', // Thanksgiving
    '2024-12-25', // Christmas
    '2025-01-01', // New Year's Day
    '2025-01-20', // MLK Jr. Day
    '2025-02-17', // Presidents Day
    '2025-04-18', // Good Friday
    '2025-05-26', // Memorial Day
    '2025-06-19', // Juneteenth
    '2025-07-04', // Independence Day
    '2025-09-01', // Labor Day
    '2025-11-27', // Thanksgiving
    '2025-12-25', // Christmas
    '2026-01-01', // New Year's Day
    '2026-01-19', // MLK Jr. Day
    '2026-02-16', // Presidents Day
    '2026-04-03', // Good Friday
    '2026-05-25', // Memorial Day
    '2026-06-19', // Juneteenth
    '2026-07-03', // Independence Day (observed, Jul 4 is Saturday)
    '2026-09-07', // Labor Day
    '2026-11-26', // Thanksgiving
    '2026-12-25', // Christmas
  ],
  'America/Chicago': [
    // CME Holidays (same as US)
    '2024-01-01', // New Year's Day
    '2024-01-15', // MLK Jr. Day
    '2024-02-19', // Presidents Day
    '2024-03-29', // Good Friday
    '2024-05-27', // Memorial Day
    '2024-06-19', // Juneteenth
    '2024-07-04', // Independence Day
    '2024-09-02', // Labor Day
    '2024-11-28', // Thanksgiving
    '2024-12-25', // Christmas
    '2025-01-01', // New Year's Day
    '2025-01-20', // MLK Jr. Day
    '2025-02-17', // Presidents Day
    '2025-04-18', // Good Friday
    '2025-05-26', // Memorial Day
    '2025-06-19', // Juneteenth
    '2025-07-04', // Independence Day
    '2025-09-01', // Labor Day
    '2025-11-27', // Thanksgiving
    '2025-12-25', // Christmas
    '2026-01-01', // New Year's Day
    '2026-01-19', // MLK Jr. Day
    '2026-02-16', // Presidents Day
    '2026-04-03', // Good Friday
    '2026-05-25', // Memorial Day
    '2026-06-19', // Juneteenth
    '2026-07-03', // Independence Day (observed, Jul 4 is Saturday)
    '2026-09-07', // Labor Day
    '2026-11-26', // Thanksgiving
    '2026-12-25', // Christmas
  ],
  'Europe/London': [
    // London Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-03-29', // Good Friday
    '2024-04-01', // Easter Monday
    '2024-05-06', // Early May Bank Holiday
    '2024-05-27', // Spring Bank Holiday
    '2024-08-26', // Summer Bank Holiday
    '2024-12-25', // Christmas
    '2024-12-26', // Boxing Day
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-05', // Early May Bank Holiday
    '2025-05-26', // Spring Bank Holiday
    '2025-08-25', // Summer Bank Holiday
    '2025-12-25', // Christmas
    '2025-12-26', // Boxing Day
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-04', // Early May Bank Holiday
    '2026-05-25', // Spring Bank Holiday
    '2026-08-31', // Summer Bank Holiday
    '2026-12-25', // Christmas
    '2026-12-28', // Boxing Day (observed, Dec 26 is Saturday)
  ],
  'Europe/Berlin': [
    // Frankfurt Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-03-29', // Good Friday
    '2024-04-01', // Easter Monday
    '2024-05-01', // Labor Day
    '2024-05-09', // Ascension Day
    '2024-05-20', // Whit Monday
    '2024-12-25', // Christmas
    '2024-12-26', // Boxing Day
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labor Day
    '2025-05-29', // Ascension Day
    '2025-06-09', // Whit Monday
    '2025-12-25', // Christmas
    '2025-12-26', // Boxing Day
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labor Day
    '2026-05-14', // Ascension Day
    '2026-05-25', // Whit Monday
    '2026-12-25', // Christmas
    '2026-12-26', // Boxing Day
  ],
  'Asia/Shanghai': [
    // Shanghai & Shenzhen Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-02-10', // Chinese New Year
    '2024-02-11', // Chinese New Year
    '2024-02-12', // Chinese New Year
    '2024-02-13', // Chinese New Year
    '2024-02-14', // Chinese New Year
    '2024-02-15', // Chinese New Year
    '2024-02-16', // Chinese New Year
    '2024-04-04', // Tomb Sweeping Day
    '2024-04-05', // Tomb Sweeping Day
    '2024-04-06', // Tomb Sweeping Day
    '2024-05-01', // Labor Day
    '2024-05-02', // Labor Day
    '2024-05-03', // Labor Day
    '2024-05-04', // Labor Day
    '2024-05-05', // Labor Day
    '2024-06-10', // Dragon Boat Festival
    '2024-09-15', // Mid-Autumn Festival
    '2024-09-16', // Mid-Autumn Festival
    '2024-09-17', // Mid-Autumn Festival
    '2024-10-01', // National Day
    '2024-10-02', // National Day
    '2024-10-03', // National Day
    '2024-10-04', // National Day
    '2024-10-05', // National Day
    '2024-10-06', // National Day
    '2024-10-07', // National Day
    '2025-01-01', // New Year's Day
    '2025-01-29', // Chinese New Year
    '2025-01-30', // Chinese New Year
    '2025-01-31', // Chinese New Year
    '2025-02-01', // Chinese New Year
    '2025-02-02', // Chinese New Year
    '2025-02-03', // Chinese New Year
    '2025-02-04', // Chinese New Year
    '2025-04-07', // Tomb Sweeping Day
    '2025-05-01', // Labor Day
    '2025-05-02', // Labor Day
    '2025-05-03', // Labor Day
    '2025-05-05', // Labor Day
    '2025-06-11', // Dragon Boat Festival
    '2025-10-01', // National Day
    '2025-10-02', // National Day
    '2025-10-03', // National Day
    '2025-10-04', // National Day
    '2025-10-05', // National Day
    '2025-10-06', // National Day
    '2025-10-07', // National Day
    '2026-01-01', // New Year's Day
    '2026-02-16', // Chinese New Year
    '2026-02-17', // Chinese New Year
    '2026-02-18', // Chinese New Year
    '2026-02-19', // Chinese New Year
    '2026-02-20', // Chinese New Year
    '2026-04-05', // Tomb Sweeping Day
    '2026-04-06', // Tomb Sweeping Day
    '2026-05-01', // Labor Day
    '2026-05-02', // Labor Day
    '2026-05-03', // Labor Day
    '2026-05-31', // Dragon Boat Festival
    '2026-10-01', // National Day
    '2026-10-02', // National Day
    '2026-10-03', // National Day
    '2026-10-04', // National Day
    '2026-10-05', // National Day
    '2026-10-06', // National Day
    '2026-10-07', // National Day
  ],
  'Asia/Hong_Kong': [
    // Hong Kong Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-02-10', // Chinese New Year
    '2024-02-13', // Chinese New Year (observed)
    '2024-02-14', // Chinese New Year (observed)
    '2024-03-29', // Good Friday
    '2024-03-30', // Easter Saturday
    '2024-04-01', // Easter Monday
    '2024-04-04', // Tomb Sweeping Day
    '2024-05-01', // Labor Day
    '2024-06-10', // Dragon Boat Festival
    '2024-09-18', // Day after Mid-Autumn Festival
    '2024-10-11', // Chung Yeung Festival
    '2024-12-25', // Christmas Day
    '2025-01-01', // New Year's Day
    '2025-01-29', // Chinese New Year
    '2025-01-30', // Chinese New Year
    '2025-02-03', // Chinese New Year (observed)
    '2025-04-04', // Ching Ming Festival
    '2025-04-11', // Good Friday
    '2025-04-12', // Easter Saturday
    '2025-04-14', // Easter Monday
    '2025-05-01', // Labor Day
    '2025-06-02', // Dragon Boat Festival
    '2025-10-01', // National Day
    '2025-10-11', // Chung Yeung Festival
    '2025-12-25', // Christmas Day
    '2026-01-01', // New Year's Day
    '2026-02-17', // Chinese New Year
    '2026-02-18', // Chinese New Year
    '2026-02-19', // Chinese New Year
    '2026-04-03', // Good Friday
    '2026-04-04', // Easter Saturday
    '2026-04-06', // Easter Monday
    '2026-04-05', // Ching Ming Festival
    '2026-05-01', // Labor Day
    '2026-05-31', // Dragon Boat Festival (Tuen Ng)
    '2026-07-01', // HKSAR Establishment Day
    '2026-10-01', // National Day
    '2026-10-19', // Chung Yeung Festival
    '2026-12-25', // Christmas Day
  ],
  'Asia/Tokyo': [
    // Tokyo Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-01-08', // Coming of Age Day
    '2024-02-11', // National Foundation Day
    '2024-02-12', // Observed Holiday
    '2024-02-23', // Emperor's Birthday
    '2024-03-20', // Vernal Equinox
    '2024-04-29', // Showa Day
    '2024-05-03', // Constitution Day
    '2024-05-04', // Greenery Day
    '2024-05-05', // Children's Day
    '2024-05-06', // Observed Holiday
    '2024-07-15', // Marine Day
    '2024-08-11', // Mountain Day
    '2024-09-16', // Respect for the Aged Day
    '2024-09-22', // Autumnal Equinox
    '2024-09-23', // Observed Holiday
    '2024-10-14', // Sports Day
    '2024-11-03', // Culture Day
    '2024-11-04', // Observed Holiday
    '2024-11-23', // Labor Thanksgiving Day
    '2025-01-01', // New Year's Day
    '2025-01-13', // Coming of Age Day
    '2025-02-11', // National Foundation Day
    '2025-02-23', // Emperor's Birthday
    '2025-02-24', // Observed Holiday
    '2025-03-20', // Vernal Equinox
    '2025-04-29', // Showa Day
    '2025-05-03', // Constitution Day
    '2025-05-04', // Greenery Day
    '2025-05-05', // Children's Day
    '2025-05-06', // Observed Holiday
    '2025-07-21', // Marine Day
    '2025-08-11', // Mountain Day
    '2025-09-15', // Respect for the Aged Day
    '2025-09-23', // Autumnal Equinox
    '2025-10-13', // Sports Day
    '2025-11-03', // Culture Day
    '2025-11-23', // Labor Thanksgiving Day
    '2026-01-01', // New Year's Day
    '2026-01-12', // Coming of Age Day
    '2026-02-11', // National Foundation Day
    '2026-02-23', // Emperor's Birthday
    '2026-03-20', // Vernal Equinox
    '2026-04-29', // Showa Day
    '2026-05-04', // Greenery Day
    '2026-05-05', // Children's Day
    '2026-05-06', // Observed Holiday (Constitution Day)
    '2026-07-20', // Marine Day
    '2026-08-11', // Mountain Day
    '2026-09-21', // Respect for the Aged Day
    '2026-09-22', // Observed Holiday
    '2026-09-23', // Autumnal Equinox
    '2026-10-12', // Sports Day
    '2026-11-03', // Culture Day
    '2026-11-23', // Labor Thanksgiving Day
  ],
  'Australia/Sydney': [
    // Sydney Stock Exchange Holidays
    '2024-01-01', // New Year's Day
    '2024-01-26', // Australia Day
    '2024-03-11', // Canberra Day (ACT)
    '2024-03-29', // Good Friday
    '2024-03-30', // Easter Saturday
    '2024-04-25', // Anzac Day
    '2024-06-10', // Queen's Birthday
    '2024-12-25', // Christmas
    '2024-12-26', // Boxing Day
    '2025-01-01', // New Year's Day
    '2025-01-27', // Australia Day (observed)
    '2025-04-25', // Anzac Day
    '2025-06-09', // Queen's Birthday
    '2025-12-25', // Christmas
    '2025-12-26', // Boxing Day
    '2026-01-01', // New Year's Day
    '2026-01-26', // Australia Day
    '2026-04-03', // Good Friday
    '2026-04-04', // Easter Saturday
    '2026-04-06', // Easter Monday
    '2026-06-08', // Queen's Birthday
    '2026-12-25', // Christmas
    '2026-12-28', // Boxing Day (observed, Dec 26 is Saturday)
  ],
};

export function isPublicHoliday(timezone: string, date: Date): boolean {
  const holidays = marketHolidays[timezone] || [];
  
  // Format date as YYYY-MM-DD in the market's timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  
  const dateStr = formatter.format(date);
  
  return holidays.includes(dateStr);
}
