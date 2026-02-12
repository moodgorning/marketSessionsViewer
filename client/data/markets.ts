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
    openTime: 21, // 10 PM UTC (Sydney opens at 10 AM AEDT which is 9 PM UTC previous day, but typically shown as 21 UTC same day for convenience)
    closeTime: 6, // 6 AM UTC (Sydney closes at 4 PM AEDT which is 5 AM UTC)
    status: 'closed',
    color: '#60A5FA', // Blue
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
