export interface StockMarket {
  name: string;
  timezone: string;
  /** Open time in minutes from midnight in the market's LOCAL timezone */
  localOpenTime: number;
  /** Close time in minutes from midnight in the market's LOCAL timezone */
  localCloseTime: number;
  status: 'open' | 'closed' | 'premarket' | 'afterhours';
  color: string;
  /**
   * Weekend rule:
   * - 'standard': closed Saturday and Sunday (most exchanges)
   * - 'futures': opens Sunday evening, closed Saturday + Sunday before open (CME)
   */
  weekendRule: 'standard' | 'futures';
}

export const markets: StockMarket[] = [
  {
    name: 'Sydney',
    timezone: 'Australia/Sydney',
    localOpenTime: 600, // 10:00 AM local
    localCloseTime: 960, // 4:00 PM local
    status: 'closed',
    color: '#60A5FA',
    weekendRule: 'standard',
  },
  {
    name: 'Shanghai',
    timezone: 'Asia/Shanghai',
    localOpenTime: 570, // 9:30 AM local
    localCloseTime: 900, // 3:00 PM local
    status: 'closed',
    color: '#F87171',
    weekendRule: 'standard',
  },
  {
    name: 'Shenzhen',
    timezone: 'Asia/Shanghai',
    localOpenTime: 570, // 9:30 AM local
    localCloseTime: 900, // 3:00 PM local
    status: 'closed',
    color: '#FB923C',
    weekendRule: 'standard',
  },
  {
    name: 'Hong Kong',
    timezone: 'Asia/Hong_Kong',
    localOpenTime: 570, // 9:30 AM local
    localCloseTime: 960, // 4:00 PM local
    status: 'closed',
    color: '#FBBF24',
    weekendRule: 'standard',
  },
  {
    name: 'Tokyo',
    timezone: 'Asia/Tokyo',
    localOpenTime: 540, // 9:00 AM local
    localCloseTime: 900, // 3:00 PM local
    status: 'closed',
    color: '#818CF8',
    weekendRule: 'standard',
  },
  {
    name: 'Frankfurt',
    timezone: 'Europe/Berlin',
    localOpenTime: 480, // 8:00 AM local
    localCloseTime: 1080, // 6:00 PM local (Xetra closes 5:30 PM, but floor until 6 PM)
    status: 'closed',
    color: '#A78BFA',
    weekendRule: 'standard',
  },
  {
    name: 'London',
    timezone: 'Europe/London',
    localOpenTime: 480, // 8:00 AM local
    localCloseTime: 990, // 4:30 PM local
    status: 'closed',
    color: '#34D399',
    weekendRule: 'standard',
  },
  {
    name: 'New York',
    timezone: 'America/New_York',
    localOpenTime: 570, // 9:30 AM local
    localCloseTime: 960, // 4:00 PM local
    status: 'closed',
    color: '#60A5FA',
    weekendRule: 'standard',
  },
  {
    name: 'CME',
    timezone: 'America/Chicago',
    localOpenTime: 1020, // 5:00 PM local (17:00)
    localCloseTime: 960, // 4:00 PM local (16:00) next day — spans midnight
    status: 'closed',
    color: '#EC4899',
    weekendRule: 'futures',
  },
];

/**
 * Get the UTC offset in minutes for a timezone at a given date.
 * Positive = east of UTC (e.g. +600 for Sydney AEST),
 * Negative = west of UTC (e.g. -300 for New York EST).
 */
export function getTimezoneOffsetMinutes(timezone: string, date: Date): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    const value = tzPart?.value || '';

    // "GMT", "GMT+10", "GMT-5", "GMT+5:30", "GMT+5:45"
    if (value === 'GMT') return 0;
    const match = value.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const minutes = parseInt(match[3] || '0', 10);
      return sign * (hours * 60 + minutes);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Convert a market's local open/close times to UTC minutes, accounting for DST.
 */
export function getMarketUTCTimes(
  market: StockMarket,
  date: Date
): { openTime: number; closeTime: number } {
  const offsetMinutes = getTimezoneOffsetMinutes(market.timezone, date);
  const openTime = ((market.localOpenTime - offsetMinutes) % 1440 + 1440) % 1440;
  const closeTime = ((market.localCloseTime - offsetMinutes) % 1440 + 1440) % 1440;
  return { openTime, closeTime };
}

/**
 * Determine if a market is currently open based on UTC time of day.
 * Does NOT account for weekends/holidays — that's handled separately.
 */
export function getMarketStatus(
  openTime: number,
  closeTime: number,
  currentMinutesUTC: number
): 'open' | 'closed' {
  if (openTime > closeTime) {
    // Market spans midnight (e.g., CME: 23:00 UTC – 21:00 UTC)
    if (currentMinutesUTC >= openTime || currentMinutesUTC < closeTime) {
      return 'open';
    }
  } else {
    if (currentMinutesUTC >= openTime && currentMinutesUTC < closeTime) {
      return 'open';
    }
  }
  return 'closed';
}

/**
 * Get the day-of-week and current local time in a market's timezone.
 */
function getMarketLocalInfo(timezone: string, now: Date): { dayName: string; localMinutes: number } {
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  });
  const dayName = dayFormatter.format(now);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: timezone,
  });
  const timeParts = timeFormatter.formatToParts(now);
  const hour = parseInt(timeParts.find((p) => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(timeParts.find((p) => p.type === 'minute')?.value || '0', 10);
  // Intl hour12:false can return 24 for midnight in some browsers
  const normalizedHour = hour === 24 ? 0 : hour;
  const localMinutes = normalizedHour * 60 + minute;

  return { dayName, localMinutes };
}

/**
 * Check if a market should be closed due to weekends.
 * Returns 'open' (no weekend closure), 'weekend', or the specific reason.
 */
export function getWeekendStatus(
  market: StockMarket,
  now: Date
): 'open' | 'weekend' {
  try {
    const { dayName, localMinutes } = getMarketLocalInfo(market.timezone, now);

    if (market.weekendRule === 'futures') {
      // CME-style: opens Sunday evening, closed all Saturday
      if (dayName === 'Sat') return 'weekend';
      if (dayName === 'Sun') {
        // Closed until market open time on Sunday
        if (localMinutes < market.localOpenTime) return 'weekend';
        return 'open';
      }
      // Friday: after close time, the market is off until Sunday evening.
      // The time-of-day check in getMarketStatus already handles this since
      // CME closes at 4 PM CT Friday and doesn't reopen until Sunday 5 PM CT.
      if (dayName === 'Fri') {
        // After close time on Friday = weekend
        if (localMinutes >= market.localCloseTime) return 'weekend';
      }
      return 'open';
    }

    // Standard: closed all Saturday and Sunday
    if (dayName === 'Sat' || dayName === 'Sun') return 'weekend';
    return 'open';
  } catch {
    return 'open';
  }
}
