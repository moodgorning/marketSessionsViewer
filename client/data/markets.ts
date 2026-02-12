export interface StockMarket {
  name: string;
  timezone: string;
  openTime: number; // Time in minutes from UTC midnight (0-1440)
  closeTime: number; // Time in minutes from UTC midnight (0-1440)
  status: 'open' | 'closed' | 'premarket' | 'afterhours';
  color: string;
}

export const markets: StockMarket[] = [
  {
    name: 'Sydney',
    timezone: 'AEDT',
    openTime: 1380, // 23:00 UTC previous day (10 AM AEDT, summer time UTC+11)
    closeTime: 300, // 05:00 AM UTC (4 PM AEDT)
    status: 'closed',
    color: '#60A5FA', // Blue
  },
  {
    name: 'Shanghai',
    timezone: 'CST',
    openTime: 90, // 01:30 AM UTC (9:30 AM CST, UTC+8)
    closeTime: 420, // 07:00 AM UTC (3 PM CST)
    status: 'closed',
    color: '#F87171', // Red
  },
  {
    name: 'Shenzhen',
    timezone: 'CST',
    openTime: 90, // 01:30 AM UTC (9:30 AM CST, UTC+8)
    closeTime: 420, // 07:00 AM UTC (3 PM CST)
    status: 'closed',
    color: '#FB923C', // Orange
  },
  {
    name: 'Hong Kong',
    timezone: 'HKT',
    openTime: 90, // 01:30 AM UTC (9:30 AM HKT, UTC+8)
    closeTime: 480, // 08:00 AM UTC (4 PM HKT)
    status: 'closed',
    color: '#FBBF24', // Amber
  },
  {
    name: 'Tokyo',
    timezone: 'JST',
    openTime: 0, // 00:00 UTC (9 AM JST, UTC+9)
    closeTime: 360, // 06:00 AM UTC (3 PM JST)
    status: 'closed',
    color: '#818CF8', // Indigo
  },
  {
    name: 'Frankfurt',
    timezone: 'CET',
    openTime: 420, // 07:00 AM UTC (8 AM CET/CEST, UTC+1/+2)
    closeTime: 1020, // 17:00 UTC (6 PM CET/CEST)
    status: 'open',
    color: '#A78BFA', // Purple
  },
  {
    name: 'London',
    timezone: 'GMT',
    openTime: 480, // 08:00 AM UTC (8 AM GMT/BST, UTC+0/+1)
    closeTime: 990, // 16:30 UTC (4:30 PM GMT/BST)
    status: 'open',
    color: '#34D399', // Teal
  },
  {
    name: 'New York',
    timezone: 'EST',
    openTime: 870, // 14:30 UTC (9:30 AM EST, UTC-5) or 13:30 UTC (EDT, UTC-4)
    closeTime: 1260, // 21:00 UTC (4 PM EST) or 20:00 UTC (EDT)
    status: 'open',
    color: '#60A5FA', // Blue
  },
];

export function getMarketStatus(market: StockMarket, currentMinutesUTC: number): 'open' | 'closed' | 'premarket' | 'afterhours' {
  // Handle markets that span midnight
  if (market.openTime > market.closeTime) {
    // Market spans midnight (e.g., Sydney: 1380-300)
    if (currentMinutesUTC >= market.openTime || currentMinutesUTC < market.closeTime) {
      return 'open';
    }
  } else {
    // Normal market hours (e.g., London: 480-990)
    if (currentMinutesUTC >= market.openTime && currentMinutesUTC < market.closeTime) {
      return 'open';
    }
  }

  return 'closed';
}
