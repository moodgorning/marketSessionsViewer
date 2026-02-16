/**
 * Dynamic holiday service that fetches exchange holidays from the Nager.Date API.
 * Falls back to static data (holidays.ts) for unsupported countries or on API failure.
 *
 * Supported via API: US, GB, DE, JP, AU
 * Static fallback only: CN, HK (not available in Nager.Date)
 */

import { isPublicHoliday as isStaticHoliday, marketHolidays } from './holidays';
import { markets } from './markets';

const API_BASE = 'https://date.nager.at/api/v3/PublicHolidays';

/** Map exchange timezones to Nager.Date country codes */
const TIMEZONE_COUNTRY: Record<string, string> = {
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Asia/Tokyo': 'JP',
  'Australia/Sydney': 'AU',
};

/**
 * NYSE/NASDAQ/CME only close for specific holidays — not all US public holidays.
 * For example, Columbus Day and Veterans Day are public holidays but exchanges remain open.
 */
const NYSE_KEYWORDS = [
  'new year',
  'martin luther king',
  'washington',
  'president',
  'good friday',
  'memorial',
  'juneteenth',
  'independence',
  'labor',
  'labour',
  'thanksgiving',
  'christmas',
];

interface NagerHoliday {
  date: string;
  name: string;
  localName: string;
  global: boolean;
  counties: string[] | null;
}

// In-memory cache: "timezone-year" → Set of "YYYY-MM-DD" strings
const cache = new Map<string, Set<string>>();
let loadPromise: Promise<void> | null = null;

/** Format a Date as YYYY-MM-DD */
function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Calculate Good Friday for a given year using the Anonymous Gregorian Easter algorithm.
 * NYSE observes Good Friday, but it's not a US federal holiday.
 */
function calculateGoodFriday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const gf = new Date(year, month - 1, day - 2);
  return fmt(gf);
}

async function fetchCountryHolidays(
  country: string,
  year: number,
): Promise<NagerHoliday[]> {
  const res = await fetch(`${API_BASE}/${year}/${country}`);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return res.json();
}

// --- Per-country processors ---

/** US: Filter to NYSE-observed holidays + ensure Good Friday is included */
function processUS(holidays: NagerHoliday[], year: number): string[] {
  const dates = holidays
    .filter((h) => {
      const combined = `${h.name} ${h.localName}`.toLowerCase();
      return NYSE_KEYWORDS.some((kw) => combined.includes(kw));
    })
    .map((h) => h.date);

  const gf = calculateGoodFriday(year);
  if (!dates.includes(gf)) dates.push(gf);

  return [...new Set(dates)];
}

/** GB: LSE follows English bank holidays only — filter out Scotland/NI-only holidays */
function processGB(holidays: NagerHoliday[]): string[] {
  return holidays
    .filter(
      (h) =>
        h.global || !h.counties || h.counties.includes('GB-ENG'),
    )
    .map((h) => h.date);
}

/**
 * JP: TSE closes on all national holidays.
 * The API may miss two edge cases:
 * 1. "Sandwich rule": a weekday between two holidays becomes a holiday
 * 2. Cascading observed holidays: when multiple holidays fall on the same date
 *    (e.g., due to Sunday→Monday shift), extras cascade to the next weekday
 */
function processJP(holidays: NagerHoliday[]): string[] {
  const dates = new Set(holidays.map((h) => h.date));

  // Count occurrences per date to detect cascading observed holidays
  const dateCounts = new Map<string, number>();
  for (const h of holidays) {
    dateCounts.set(h.date, (dateCounts.get(h.date) || 0) + 1);
  }

  // For dates with multiple holidays, add substitute days
  for (const [date, count] of dateCounts) {
    if (count > 1) {
      let nextDate = new Date(date + 'T00:00:00');
      let added = 0;
      while (added < count - 1) {
        nextDate.setDate(nextDate.getDate() + 1);
        const nextStr = fmt(nextDate);
        const day = nextDate.getDay();
        if (day !== 0 && day !== 6 && !dates.has(nextStr)) {
          dates.add(nextStr);
          added++;
        }
      }
    }
  }

  // Sandwich rule: a weekday between two holidays becomes a holiday
  const sorted = [...dates].sort();
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i] + 'T00:00:00');
    const next = new Date(sorted[i + 1] + 'T00:00:00');
    const diffDays =
      (next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 2) {
      const between = new Date(curr);
      between.setDate(between.getDate() + 1);
      if (between.getDay() !== 0 && between.getDay() !== 6) {
        dates.add(fmt(between));
      }
    }
  }

  return [...dates];
}

/** AU: ASX follows national + NSW state holidays */
function processAU(holidays: NagerHoliday[]): string[] {
  return holidays
    .filter(
      (h) =>
        h.global || !h.counties || h.counties.includes('AU-NSW'),
    )
    .map((h) => h.date);
}

/** Default: use all holidays (works for DE/Frankfurt) */
function processDefault(holidays: NagerHoliday[]): string[] {
  return holidays.map((h) => h.date);
}

function getStaticHolidays(timezone: string, year: number): Set<string> {
  const all = marketHolidays[timezone] || [];
  return new Set(all.filter((d) => d.startsWith(`${year}-`)));
}

/**
 * Fetch and cache holidays for all market timezones.
 * Safe to call multiple times — subsequent calls return the same promise.
 */
export function loadHolidays(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const year = new Date().getFullYear();
    const timezones = [...new Set(markets.map((m) => m.timezone))];

    // Group timezones by country to avoid duplicate API calls
    const countryTzMap = new Map<string, string[]>();

    for (const tz of timezones) {
      const key = `${tz}-${year}`;
      if (cache.has(key)) continue;

      const country = TIMEZONE_COUNTRY[tz];
      if (country) {
        if (!countryTzMap.has(country)) countryTzMap.set(country, []);
        countryTzMap.get(country)!.push(tz);
      } else {
        // No API support (CN, HK) — use static data
        cache.set(key, getStaticHolidays(tz, year));
      }
    }

    const tasks = [...countryTzMap.entries()].map(
      async ([country, tzs]) => {
        try {
          const holidays = await fetchCountryHolidays(country, year);

          // Process holidays based on country-specific rules
          let dates: string[];
          switch (country) {
            case 'US':
              dates = processUS(holidays, year);
              break;
            case 'GB':
              dates = processGB(holidays);
              break;
            case 'JP':
              dates = processJP(holidays);
              break;
            case 'AU':
              dates = processAU(holidays);
              break;
            default:
              dates = processDefault(holidays);
          }

          // All timezones sharing a country get the same holidays
          for (const tz of tzs) {
            cache.set(`${tz}-${year}`, new Set(dates));
          }
        } catch (err) {
          console.warn(
            `Failed to fetch holidays for ${country}, using static fallback`,
            err,
          );
          for (const tz of tzs) {
            cache.set(`${tz}-${year}`, getStaticHolidays(tz, year));
          }
        }
      },
    );

    await Promise.allSettled(tasks);
  })();

  return loadPromise;
}

/**
 * Check if a date is a public holiday for a given exchange timezone.
 * Uses cached API data if available, otherwise falls back to static data.
 */
export function isPublicHoliday(timezone: string, date: Date): boolean {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  const dateStr = formatter.format(date);
  const year = parseInt(dateStr.substring(0, 4));
  const key = `${timezone}-${year}`;

  const dates = cache.get(key);
  if (dates) return dates.has(dateStr);

  // Cache not populated yet — fall back to static data
  return isStaticHoliday(timezone, date);
}
