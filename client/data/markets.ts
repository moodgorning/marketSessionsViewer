export interface StockMarket {
  name: string;
  timezone: string;
  openTime: number; // Hour in UTC (0-23)
  closeTime: number; // Hour in UTC (0-23)
  status: 'open' | 'closed' | 'premarket' | 'afterhours';
  color: string;
}

export const markets: StockMarket[] = [
  {
    name: 'Sydney',
    timezone: 'AEDT',
    openTime: 21, // 10 PM UTC (Sydney opens at 10 AM AEDT)
    closeTime: 6, // 6 AM UTC (Sydney closes at 4 PM AEDT)
    status: 'closed',
    color: '#60A5FA', // Blue
  },
  {
    name: 'Shanghai',
    timezone: 'CST',
    openTime: 1, // 1:30 AM UTC (Shanghai opens at 9:30 AM CST)
    closeTime: 7, // 7 AM UTC (Shanghai closes at 3 PM CST)
    status: 'closed',
    color: '#F87171', // Red
  },
  {
    name: 'Shenzhen',
    timezone: 'CST',
    openTime: 1, // 1:30 AM UTC (Shenzhen opens at 9:30 AM CST)
    closeTime: 7, // 7 AM UTC (Shenzhen closes at 3 PM CST)
    status: 'closed',
    color: '#FB923C', // Orange
  },
  {
    name: 'Hong Kong',
    timezone: 'HKT',
    openTime: 1, // 1:30 AM UTC (Hong Kong opens at 9:30 AM HKT)
    closeTime: 8, // 8 AM UTC (Hong Kong closes at 4 PM HKT)
    status: 'closed',
    color: '#FBBF24', // Amber
  },
  {
    name: 'Tokyo',
    timezone: 'JST',
    openTime: 23, // 11 PM UTC (Tokyo opens at 9 AM JST)
    closeTime: 6, // 6 AM UTC (Tokyo closes at 3 PM JST)
    status: 'closed',
    color: '#818CF8', // Indigo
  },
  {
    name: 'Frankfurt',
    timezone: 'CET',
    openTime: 7, // 7 AM UTC (Frankfurt opens at 8 AM CET)
    closeTime: 17, // 5 PM UTC (Frankfurt closes at 6 PM CET, main trading)
    status: 'open',
    color: '#A78BFA', // Purple
  },
  {
    name: 'London',
    timezone: 'GMT',
    openTime: 8, // 8 AM UTC
    closeTime: 16, // 4 PM UTC
    status: 'open',
    color: '#34D399', // Teal
  },
  {
    name: 'New York',
    timezone: 'EST',
    openTime: 13, // 1 PM UTC (9:30 AM EST)
    closeTime: 21, // 9 PM UTC (4 PM EST)
    status: 'open',
    color: '#60A5FA', // Blue
  },
];

export function getMarketStatus(market: StockMarket, currentHourUTC: number): 'open' | 'closed' | 'premarket' | 'afterhours' {
  // For simplicity, we'll use a fixed time for demonstration
  // In a real app, you'd use the actual current time
  const hour = currentHourUTC || new Date().getUTCHours();
  
  // Handle markets that span midnight
  if (market.openTime > market.closeTime) {
    // Market spans midnight (e.g., Sydney: 21-6)
    if (hour >= market.openTime || hour < market.closeTime) {
      return 'open';
    }
  } else {
    // Normal market hours (e.g., London: 8-16)
    if (hour >= market.openTime && hour < market.closeTime) {
      return 'open';
    }
  }
  
  return 'closed';
}
