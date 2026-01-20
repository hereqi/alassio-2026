"use client";

import { useState, useEffect } from "react";
import { Availability, AvailabilityInput } from "@/lib/types";

interface AvailabilityFormProps {
  onSubmit: (data: AvailabilityInput) => Promise<void>;
  onCancel: () => void;
  initialData?: Availability;
  isLoading?: boolean;
}

/**
 * Formular zum Erstellen/Bearbeiten einer Verfügbarkeit
 */
export function AvailabilityForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AvailabilityFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [from, setFrom] = useState(initialData?.from || "2026-07-01");
  const [to, setTo] = useState(initialData?.to || "2026-07-31");
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  // Reset form wenn initialData sich ändert
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setFrom(initialData.from);
      setTo(initialData.to);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-seitige Validierung
    if (!name.trim()) {
      setError("Bitte gib deinen Namen ein");
      return;
    }

    if (!from || !to) {
      setError("Bitte wähle Von und Bis Datum");
      return;
    }

    // Prüfe Juli 2026
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate.getMonth() !== 6 || fromDate.getFullYear() !== 2026) {
      setError("Von-Datum muss im Juli 2026 liegen");
      return;
    }

    if (toDate.getMonth() !== 6 || toDate.getFullYear() !== 2026) {
      setError("Bis-Datum muss im Juli 2026 liegen");
      return;
    }

    if (fromDate > toDate) {
      setError("Von-Datum muss vor oder gleich Bis-Datum sein");
      return;
    }

    try {
      await onSubmit({ name: name.trim(), from, to });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Feld */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-200 mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          maxLength={50}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Datum Felder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="from"
            className="block text-sm font-semibold text-slate-200 mb-2"
          >
            Von
          </label>
          <input
            type="date"
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            min="2026-07-01"
            max="2026-07-31"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all [color-scheme:dark]"
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="to"
            className="block text-sm font-semibold text-slate-200 mb-2"
          >
            Bis
          </label>
          <input
            type="date"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min="2026-07-01"
            max="2026-07-31"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all [color-scheme:dark]"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Hinweis */}
      <p className="text-sm text-slate-400">
        ℹ️ Nur Daten im Juli 2026 sind erlaubt (1. - 31. Juli)
      </p>

      {/* Fehleranzeige */}
      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-lg hover:from-amber-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Speichern...
            </span>
          ) : isEdit ? (
            "Änderungen speichern"
          ) : (
            "Verfügbarkeit eintragen"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}

