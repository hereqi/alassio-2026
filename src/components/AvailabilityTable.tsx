"use client";

import { Availability } from "@/lib/types";
import { isDayInRange, getWeekdayForJulyDay, DAYS_IN_JULY } from "@/lib/utils";
import { getColorForName } from "@/lib/colors";

interface AvailabilityTableProps {
  availabilities: Availability[];
}

/**
 * Monatsübersicht als Grid
 * Zeilen = Personen, Spalten = Tage 1-31
 */
export function AvailabilityTable({ availabilities }: AvailabilityTableProps) {
  const days = Array.from({ length: DAYS_IN_JULY }, (_, i) => i + 1);

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
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/30">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            {/* Wochentag Zeile */}
            <tr className="bg-slate-800/80">
              <th className="sticky left-0 z-20 bg-slate-800 p-2 text-left text-xs font-medium text-slate-500 border-b border-slate-700 min-w-[120px]">
                
              </th>
              {days.map((day) => (
                <th
                  key={`weekday-${day}`}
                  className="p-1 text-center text-[10px] font-medium text-slate-500 border-b border-slate-700"
                >
                  {getWeekdayForJulyDay(day)}
                </th>
              ))}
            </tr>
            {/* Tag Nummer Zeile */}
            <tr className="bg-slate-800/80 sticky top-0 z-10">
              <th className="sticky left-0 z-20 bg-slate-800 p-2 text-left text-sm font-semibold text-slate-300 border-b border-slate-700">
                Name
              </th>
              {days.map((day) => {
                // Wochenende hervorheben
                const date = new Date(2026, 6, day);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <th
                    key={`day-${day}`}
                    className={`p-2 text-center text-sm font-semibold border-b border-slate-700 min-w-[32px] ${
                      isWeekend ? "text-amber-400" : "text-slate-300"
                    }`}
                  >
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {availabilities.map((availability, index) => {
              const colors = getColorForName(availability.name);
              return (
                <tr
                  key={availability.id}
                  className={`${
                    index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                  } hover:bg-slate-700/30 transition-colors`}
                >
                  {/* Name Spalte - sticky */}
                  <td
                    className={`sticky left-0 z-10 p-2 text-sm font-medium text-white border-r border-slate-700 ${
                      index % 2 === 0 ? "bg-slate-900/90" : "bg-slate-800/90"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}
                      />
                      <span className="truncate max-w-[100px]">
                        {availability.name}
                      </span>
                    </div>
                  </td>
                  {/* Tage */}
                  {days.map((day) => {
                    const isInRange = isDayInRange(
                      day,
                      availability.from,
                      availability.to
                    );
                    return (
                      <td
                        key={`${availability.id}-${day}`}
                        className={`p-0 text-center border-r border-slate-700/50 last:border-r-0`}
                      >
                        {isInRange && (
                          <div
                            className={`w-full h-8 ${colors.bg} opacity-80`}
                            title={`${availability.name}: ${day}. Juli`}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Kompakte Liste */}
      <div className="md:hidden divide-y divide-slate-700">
        {availabilities.map((availability) => {
          const colors = getColorForName(availability.name);
          const fromDay = new Date(availability.from).getDate();
          const toDay = new Date(availability.to).getDate();
          const duration = toDay - fromDay + 1;

          return (
            <div key={availability.id} className="p-4">
              <div className="flex items-start gap-3">
                {/* Farbindikator */}
                <div className={`w-1 h-full min-h-[60px] rounded-full ${colors.bg} flex-shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  {/* Name + Datum */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                    <span className="font-semibold text-white text-base">
                      {availability.name}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-3">
                    {fromDay}. – {toDay}. Juli ({duration} {duration === 1 ? "Tag" : "Tage"})
                  </div>

                  {/* Horizontales Scrollbares Mini-Kalender */}
                  <div className="overflow-x-auto -mx-4 px-4">
                    <div className="flex gap-1 min-w-max pb-2">
                      {days.map((day) => {
                        const isInRange = isDayInRange(
                          day,
                          availability.from,
                          availability.to
                        );
                        const date = new Date(2026, 6, day);
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        return (
                          <div
                            key={day}
                            className={`w-8 h-8 flex flex-col items-center justify-center rounded text-[10px] flex-shrink-0 ${
                              isInRange
                                ? `${colors.bg} ${colors.text} font-bold`
                                : isWeekend
                                ? "bg-slate-700/50 text-amber-400/60"
                                : "bg-slate-700/30 text-slate-500"
                            }`}
                          >
                            <span className="text-[9px] opacity-70">
                              {getWeekdayForJulyDay(day).charAt(0)}
                            </span>
                            <span className="leading-none">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

