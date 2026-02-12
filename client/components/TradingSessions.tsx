import React, { useMemo, useState, useEffect } from 'react';
import { markets, getMarketStatus } from '@/data/markets';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const hours = Array.from({ length: 24 }, (_, i) => i);

// Format minutes as 12-hour time with AM/PM
const formatTime = (minutes: number): string => {
  const totalMinutes = (minutes % 1440); // Normalize to 24-hour cycle
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours < 12 ? 'AM' : 'PM';
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
};

export function TradingSessions() {
  const [now, setNow] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHourLocal = now.getHours();
  const currentMinLocal = now.getMinutes();
  const currentSecLocal = now.getSeconds();
  const currentMinutesLocal = currentHourLocal * 60 + currentMinLocal + currentSecLocal / 60;
  const currentHourUTC = now.getUTCHours();
  const currentMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes() + now.getUTCSeconds() / 60;
  const currentPercentage = (currentMinutesLocal / (24 * 60)) * 100;

  // Helper function to check if a specific market is in weekend using its timezone
  const isMarketWeekend = (marketTimezone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: marketTimezone,
      });
      const dayName = formatter.format(now);
      return dayName === 'Sat' || dayName === 'Sun';
    } catch {
      // If timezone conversion fails, assume it's not a weekend
      return false;
    }
  };

  // Get local timezone name
  const timezoneName = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Local Time';
    }
  }, []);

  // Calculate timezone offset in minutes
  const timezoneOffsetMinutes = -now.getTimezoneOffset();

  // Convert UTC minutes to local timezone
  const convertUTCToLocal = (utcMinutes: number) => {
    return (utcMinutes + timezoneOffsetMinutes + 24 * 60) % (24 * 60);
  };

  const getBarStyle = (market: any) => {
    const minuteWidth = 100 / (24 * 60);

    if (market.openTime > market.closeTime) {
      // Spans midnight
      const part1Width = (1440 - market.openTime) * minuteWidth;
      const part2Width = market.closeTime * minuteWidth;

      return {
        segments: [
          {
            left: market.openTime * minuteWidth,
            width: part1Width,
          },
          {
            left: 0,
            width: part2Width,
          },
        ],
      };
    } else {
      // Normal hours
      return {
        segments: [
          {
            left: market.openTime * minuteWidth,
            width: (market.closeTime - market.openTime) * minuteWidth,
          },
        ],
      };
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-2">Trading Sessions</h1>
          <p className="text-gray-400 text-sm">Shown in {timezoneName}</p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Hour labels */}
          <div className="flex text-xs font-semibold text-gray-400 mb-6 ml-32">
            {hours.map((hour) => {
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              const period = hour < 12 ? 'AM' : 'PM';
              return (
                <div
                  key={`label-${hour}`}
                  className="flex-1 text-center"
                >
                  {displayHour} {period}
                </div>
              );
            })}
          </div>

          {/* Markets section */}
          <div className="space-y-6">
            {markets
              .map(market => {
                const localOpenTime = convertUTCToLocal(market.openTime);
                return { market, localOpenTime };
              })
              .sort((a, b) => a.localOpenTime - b.localOpenTime)
              .map(({ market }) => {
              let status = getMarketStatus(market, currentMinutesUTC);

              // Override status if it's a weekend in that market's timezone
              if (isMarketWeekend(market.timezone)) {
                status = 'closed';
              }

              // Convert market hours to local timezone
              const localOpenTime = convertUTCToLocal(market.openTime);
              const localCloseTime = convertUTCToLocal(market.closeTime);
              const localMarket = { ...market, openTime: localOpenTime, closeTime: localCloseTime };

              const barStyle = getBarStyle(localMarket);

              return (
                <div key={market.name} className="flex items-center gap-6">
                  {/* Market name column */}
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-semibold whitespace-nowrap">{market.name}</span>
                  </div>

                  {/* Status badge column */}
                  <div className="w-20 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                        status === 'open'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-red-900/40 text-red-400'
                      }`}
                    >
                      {status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Timeline bar */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1 relative h-7 bg-gray-800/40 rounded border border-gray-700/40 cursor-pointer hover:bg-gray-800/60 transition-colors">
                        {barStyle.segments.map((segment, idx) => (
                          <div
                            key={idx}
                            className="absolute top-0 bottom-0 rounded"
                            style={{
                              left: `${segment.left}%`,
                              width: `${segment.width}%`,
                              backgroundColor: market.color,
                              opacity: status === 'open' ? 0.9 : 0.4,
                            }}
                          />
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">{market.name} {market.timezone}</p>
                        <p>{formatTime(localOpenTime)} - {formatTime(localCloseTime)}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          {/* Current time indicator line - positioned outside markets container */}
          <div
            className="absolute w-1 bg-blue-500 pointer-events-none shadow-lg"
            style={{
              left: `calc(7rem + ${currentPercentage}%)`,
              top: '1rem',
              bottom: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
