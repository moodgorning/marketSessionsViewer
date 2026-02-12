import React, { useMemo, useState, useEffect } from 'react';
import { markets, getMarketStatus } from '@/data/markets';
import { isPublicHoliday } from '@/data/holidays';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

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
  const [helpOpen, setHelpOpen] = useState(false);

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

  // Calculate position as percentage within the 24-hour day
  const dayProgressFraction = currentMinutesLocal / (24 * 60);

  // The timeline bars start at 14rem (6rem + 1.5rem + 5rem + 1.5rem)
  // and extend to 100% of the container.
  // So position = 14rem + dayProgressFraction * (100% - 14rem)
  // Expressed as: 14rem + dayProgressFraction * 100% = left calculation
  // But since we can't easily do (100% - 14rem) in calc with units, we'll use pixels/rem
  // Position from start of timeline bars (at 14rem): dayProgressFraction * (100% - 14rem)
  const timelineBarStartRem = 14; // 6 + 1.5 + 5 + 1.5
  const timelineOffsetPercent = (dayProgressFraction * 100);

  // Helper function to check if a specific market is closed (weekend or holiday) using its timezone
  const isMarketClosed = (marketTimezone: string) => {
    try {
      // Check for weekend
      const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: marketTimezone,
      });
      const dayName = formatter.format(now);
      const isWeekend = dayName === 'Sat' || dayName === 'Sun';

      // Check for public holiday
      const isHoliday = isPublicHoliday(marketTimezone, now);

      return isWeekend || isHoliday;
    } catch {
      // If timezone conversion fails, assume it's not closed
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
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2">Trading Sessions</h1>
            <p className="text-gray-400 text-sm">Shown in {timezoneName}</p>
          </div>

          {/* Help button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHelpOpen(true)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            title="Help"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>

        {/* Help Modal */}
        <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Market Session Viewer - Help</DialogTitle>
              <DialogDescription>Learn how to use this tool</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">What is this?</h3>
                <p>
                  The Market Session Viewer displays the trading hours of major stock exchanges around the world on a 24-hour timeline. Each colored bar represents when that exchange is open for trading.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Reading the Timeline</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Blue vertical line:</strong> Current time in your timezone, updated every second</li>
                  <li><strong>Colored bars:</strong> Trading hours for each exchange</li>
                  <li><strong>Hour labels:</strong> 24-hour clock showing times in your timezone</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Status Indicators</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Green "Open":</strong> Exchange is currently trading</li>
                  <li><strong>Red "Closed":</strong> Exchange is closed</li>
                  <li>Markets are closed on weekends and public holidays</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Interactive Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Hover over any bar:</strong> See exact opening and closing times</li>
                  <li><strong>Sorted by opening time:</strong> Markets are listed from earliest to latest opening time in your timezone</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Markets Included</h3>
                <p>
                  Sydney, Shanghai, Shenzhen, Hong Kong, Tokyo, Frankfurt, London, New York, and CME (Chicago Mercantile Exchange)
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Timezone Awareness</h3>
                <p>
                  All times are automatically converted to your local browser timezone. You can see what time each market opens and closes in your local time, accounting for daylight saving time differences.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Timeline Container */}
        <div className="relative">
          {/* Hour labels - absolutely positioned over timeline (same as vertical lines) */}
          <div className="mb-6 h-6">
            {hours.filter(hour => hour % 3 === 0).map((hour, index) => {
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              const period = hour < 12 ? 'AM' : 'PM';
              const percentageOfTimeline = (index / 8) * 100;
              return (
                <div
                  key={`label-${hour}`}
                  className="absolute text-left whitespace-nowrap text-xs font-semibold text-gray-400"
                  style={{
                    left: `calc(6rem + 1.5rem + 5rem + 1.5rem + ${percentageOfTimeline}%)`,
                  }}
                >
                  {displayHour} {period}
                </div>
              );
            })}
          </div>

          {/* Markets section */}
          <div className="space-y-6 relative">
            {/* Vertical separator lines at 3-hour boundaries (every 12.5%) */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const percentageOfTimeline = (index / 8) * 100;
              // Position: left columns (14rem) + percentage of timeline
              return (
                <div
                  key={`vline-${index}`}
                  className="absolute top-0 bottom-0 w-px bg-gray-700/40 pointer-events-none"
                  style={{
                    left: `calc(6rem + 1.5rem + 5rem + 1.5rem + ${percentageOfTimeline}%)`,
                  }}
                />
              );
            })}

            {markets
              .map(market => {
                const localOpenTime = convertUTCToLocal(market.openTime);
                return { market, localOpenTime };
              })
              .sort((a, b) => a.localOpenTime - b.localOpenTime)
              .map(({ market }) => {
              let status = getMarketStatus(market, currentMinutesUTC);

              // Override status if it's a weekend or public holiday in that market's timezone
              if (isMarketClosed(market.timezone)) {
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

          {/* Current time indicator line - aligned with timeline bars (starts at w-24 + gap-6 + w-20 + gap-6 = 14rem) */}
          <div
            className="absolute w-1 bg-blue-500 pointer-events-none shadow-lg"
            style={{
              left: `calc(${(14 * (1 - dayProgressFraction)).toFixed(3)}rem + ${(dayProgressFraction * 100).toFixed(2)}%)`,
              top: '1rem',
              bottom: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
