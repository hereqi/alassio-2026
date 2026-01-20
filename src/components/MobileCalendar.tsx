"use client";

import { Availability } from "@/lib/types";
import { isDayInRange, DAYS_IN_JULY, calculateDayOverlaps } from "@/lib/utils";
import { getColorForName } from "@/lib/colors";

interface MobileCalendarProps {
  availabilities: Availability[];
}

/**
 * Mobile Kalender - Alle 31 Tage auf einem Screen, wie iOS Kalender
 */
export function MobileCalendar({ availabilities }: MobileCalendarProps) {
  const days = Array.from({ length: DAYS_IN_JULY }, (_, i) => i + 1);
  const overlaps = calculateDayOverlaps(availabilities);

  // Juli 2026 startet am Mittwoch (3 leere Felder für Mo, Di davor)
  const startOffset = 2; // Mittwoch = Index 2 (Mo=0, Di=1, Mi=2)
  const paddedDays = [...Array(startOffset).fill(null), ...days];

  // Wochentage Header
  const weekdays = ["M", "D", "M", "D", "F", "S", "S"];

  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-slate-400 text-sm">
          Noch keine Einträge
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Wochentage Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`text-center text-xs font-medium py-1 ${
              i >= 5 ? "text-amber-400" : "text-slate-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = new Date(2026, 6, day);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const availableNames = overlaps.get(day) || [];
          const count = availableNames.length;

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col p-0.5 ${
                isWeekend
                  ? "bg-slate-800/80 ring-1 ring-amber-400/30"
                  : "bg-slate-800/50"
              }`}
            >
              {/* Tag-Nummer */}
              <div
                className={`text-center text-xs font-bold leading-none ${
                  isWeekend ? "text-amber-400" : "text-white"
                }`}
              >
                {day}
              </div>

              {/* Farbbalken für verfügbare Personen */}
              <div className="flex-1 flex flex-col gap-[1px] mt-0.5 overflow-hidden">
                {availableNames.slice(0, 4).map((name, i) => {
                  const colors = getColorForName(name);
                  return (
                    <div
                      key={`${day}-${name}-${i}`}
                      className={`w-full h-[3px] rounded-sm ${colors.bg}`}
                      title={name}
                    />
                  );
                })}
                {count > 4 && (
                  <div className="text-[6px] text-slate-400 text-center leading-none">
                    +{count - 4}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legende */}
      <div className="mt-4 flex flex-wrap gap-2">
        {availabilities.map((a) => {
          const colors = getColorForName(a.name);
          const fromDay = new Date(a.from).getDate();
          const toDay = new Date(a.to).getDate();
          return (
            <div
              key={a.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text} font-medium`}
            >
              <span>{a.name}</span>
              <span className="opacity-70">({fromDay}-{toDay})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
