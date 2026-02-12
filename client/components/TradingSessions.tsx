import React, { useMemo } from 'react';
import { markets, getMarketStatus } from '@/data/markets';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const hours = Array.from({ length: 24 }, (_, i) => i);

// Format hour as 12-hour time with AM/PM
const formatTime = (hour: number): string => {
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? 'AM' : 'PM';
  return `${displayHour}:00 ${period}`;
};

export function TradingSessions() {
  const now = new Date();
  const currentHourLocal = now.getHours();
  const currentMinLocal = now.getMinutes();
  const currentHourUTC = now.getUTCHours();
  const currentPercentage = ((currentHourLocal * 60 + currentMinLocal) / (24 * 60)) * 100;

  // Get local timezone name
  const timezoneName = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Local Time';
    }
  }, []);

  // Calculate timezone offset in hours
  const timezoneOffsetHours = -now.getTimezoneOffset() / 60;

  // Convert UTC hours to local timezone
  const convertUTCToLocal = (utcHour: number) => {
    return (utcHour + timezoneOffsetHours + 24) % 24;
  };

  const getBarStyle = (market: any) => {
    const hourWidth = 100 / 24;

    if (market.openTime > market.closeTime) {
      // Spans midnight (Sydney, Tokyo)
      const part1Width = (24 - market.openTime) * hourWidth;
      const part2Width = market.closeTime * hourWidth;

      return {
        segments: [
          {
            left: market.openTime * hourWidth,
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
            left: market.openTime * hourWidth,
            width: (market.closeTime - market.openTime) * hourWidth,
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
          <div className="space-y-6 relative">
            {markets.map((market) => {
              const status = getMarketStatus(market, currentHourUTC);

              // Convert market hours to local timezone
              const localOpenTime = convertUTCToLocal(market.openTime);
              const localCloseTime = convertUTCToLocal(market.closeTime);
              const localMarket = { ...market, openTime: localOpenTime, closeTime: localCloseTime };

              const barStyle = getBarStyle(localMarket);

              return (
                <div key={market.name} className="flex items-start gap-8">
                  {/* Market label and status */}
                  <div className="w-28 flex-shrink-0 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{market.name}</span>
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
                        <p>{formatTime(Math.floor(localOpenTime))} - {formatTime(Math.floor(localCloseTime))}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}

            {/* Current time indicator line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-500 pointer-events-none shadow-lg"
              style={{
                left: `calc(7rem + ${currentPercentage * 100 / 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
