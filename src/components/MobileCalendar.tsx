"use client";

import { Availability } from "@/lib/types";
import { isDayInRange, getWeekdayForJulyDay, DAYS_IN_JULY, calculateDayOverlaps } from "@/lib/utils";
import { getColorForName } from "@/lib/colors";

interface MobileCalendarProps {
  availabilities: Availability[];
}

/**
 * Mobile Kalender mit großen Feldern - mehrere Farben pro Tag
 */
export function MobileCalendar({ availabilities }: MobileCalendarProps) {
  const days = Array.from({ length: DAYS_IN_JULY }, (_, i) => i + 1);
  const overlaps = calculateDayOverlaps(availabilities);

  if (availabilities.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <p className="text-slate-400">
          Keine Verfügbarkeiten vorhanden. Trage die erste ein!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const date = new Date(2026, 6, day);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const availableNames = overlaps.get(day) || [];
        const count = availableNames.length;

        return (
          <div
            key={day}
            className={`w-full min-h-[80px] rounded-xl border-2 p-4 ${
              isWeekend
                ? "bg-slate-800/50 border-amber-400/30"
                : "bg-slate-800/30 border-slate-700"
            }`}
          >
            {/* Header: Tag + Wochentag */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${
                    isWeekend ? "text-amber-400" : "text-white"
                  }`}
                >
                  {day}
                </span>
                <span className="text-sm text-slate-400">
                  {getWeekdayForJulyDay(day)}
                </span>
              </div>
              {count > 0 && (
                <span className="text-sm font-semibold text-slate-300">
                  {count} {count === 1 ? "Person" : "Personen"}
                </span>
              )}
            </div>

            {/* Farbbalken für verfügbare Personen */}
            {count > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableNames.map((name, index) => {
                  const colors = getColorForName(name);
                  return (
                    <div
                      key={`${day}-${name}-${index}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.text} flex-shrink-0`}
                    >
                      <div className={`w-2 h-2 rounded-full ${colors.bg} ${colors.border} border-2`} />
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">
                Keine Verfügbarkeiten
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

