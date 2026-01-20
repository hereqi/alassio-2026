"use client";

import { Availability } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { getColorForName } from "@/lib/colors";

interface AvailabilityListProps {
  availabilities: Availability[];
  onEdit: (availability: Availability) => void;
  onDelete: (id: string) => void;
  isDeleting?: string | null;
}

/**
 * Liste aller eingetragenen Verfügbarkeiten
 */
export function AvailabilityList({
  availabilities,
  onEdit,
  onDelete,
  isDeleting,
}: AvailabilityListProps) {
  if (availabilities.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-6xl mb-4">🏖️</div>
        <p className="text-slate-400 text-lg">
          Noch keine Verfügbarkeiten eingetragen.
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Sei der Erste und trage deine Verfügbarkeit ein!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {availabilities.map((availability) => {
        const colors = getColorForName(availability.name);
        const isCurrentlyDeleting = isDeleting === availability.id;

        return (
          <div
            key={availability.id}
            className={`group flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-all ${
              isCurrentlyDeleting ? "opacity-50" : ""
            }`}
          >
            {/* Linker Teil: Farbe + Name + Datum */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Farbindikator */}
              <div
                className={`w-3 h-12 rounded-full ${colors.bg} flex-shrink-0`}
              />

              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {availability.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {formatDateShort(availability.from)} –{" "}
                  {formatDateShort(availability.to)}
                </p>
              </div>
            </div>

            {/* Rechter Teil: Aktionen */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(availability)}
                disabled={isCurrentlyDeleting}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-all"
                title="Bearbeiten"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(availability.id)}
                disabled={isCurrentlyDeleting}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-all"
                title="Löschen"
              >
                {isCurrentlyDeleting ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

