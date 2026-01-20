import {
  parseISO,
  isWithinInterval,
  eachDayOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  isValid,
  isBefore,
  isAfter,
} from "date-fns";
import { de } from "date-fns/locale";
import { Availability } from "./types";

// Juli 2026 Konstanten
export const JULY_2026_START = new Date(2026, 6, 1); // Monat ist 0-basiert
export const JULY_2026_END = new Date(2026, 6, 31);
export const DAYS_IN_JULY = 31;

/**
 * Prüft ob ein Datum im Juli 2026 liegt
 */
export function isInJuly2026(date: Date | string): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return false;

  return isWithinInterval(d, {
    start: startOfMonth(JULY_2026_START),
    end: endOfMonth(JULY_2026_START),
  });
}

/**
 * Validiert die Eingabedaten für eine Availability
 */
export function validateAvailability(
  name: string,
  from: string,
  to: string
): { valid: boolean; error?: string } {
  // Name validieren
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Name ist erforderlich" };
  }

  if (name.trim().length > 50) {
    return { valid: false, error: "Name darf maximal 50 Zeichen haben" };
  }

  // Datum parsen
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  if (!isValid(fromDate) || !isValid(toDate)) {
    return { valid: false, error: "Ungültiges Datumsformat" };
  }

  // Juli 2026 prüfen
  if (!isInJuly2026(fromDate)) {
    return { valid: false, error: "Von-Datum muss im Juli 2026 liegen" };
  }

  if (!isInJuly2026(toDate)) {
    return { valid: false, error: "Bis-Datum muss im Juli 2026 liegen" };
  }

  // from <= to prüfen
  if (isAfter(fromDate, toDate)) {
    return { valid: false, error: "Von-Datum muss vor oder gleich Bis-Datum sein" };
  }

  return { valid: true };
}

/**
 * Prüft ob ein bestimmter Tag (1-31) im Verfügbarkeitsbereich liegt
 */
export function isDayInRange(
  day: number,
  from: string,
  to: string
): boolean {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  if (!isValid(fromDate) || !isValid(toDate)) return false;

  const fromDay = fromDate.getDate();
  const toDay = toDate.getDate();

  return day >= fromDay && day <= toDay;
}

/**
 * Formatiert ein Datum für die Anzeige
 */
export function formatDate(date: string): string {
  const d = parseISO(date);
  if (!isValid(d)) return date;
  return format(d, "d. MMMM yyyy", { locale: de });
}

/**
 * Formatiert ein Datum kurz (nur Tag)
 */
export function formatDateShort(date: string): string {
  const d = parseISO(date);
  if (!isValid(d)) return date;
  return format(d, "d. MMM", { locale: de });
}

/**
 * Berechnet die Anzahl der Personen pro Tag
 */
export function calculateDayOverlaps(
  availabilities: Availability[]
): Map<number, string[]> {
  const overlaps = new Map<number, string[]>();

  // Initialisiere alle Tage
  for (let day = 1; day <= DAYS_IN_JULY; day++) {
    overlaps.set(day, []);
  }

  // Zähle Personen pro Tag
  for (const availability of availabilities) {
    const fromDay = parseISO(availability.from).getDate();
    const toDay = parseISO(availability.to).getDate();

    for (let day = fromDay; day <= toDay; day++) {
      const current = overlaps.get(day) || [];
      current.push(availability.name);
      overlaps.set(day, current);
    }
  }

  return overlaps;
}

/**
 * Findet die Top-Tage mit den meisten Überschneidungen
 */
export function getTopOverlapDays(
  availabilities: Availability[],
  topN: number = 3
): { day: number; count: number; names: string[] }[] {
  const overlaps = calculateDayOverlaps(availabilities);

  const sorted = Array.from(overlaps.entries())
    .map(([day, names]) => ({ day, count: names.length, names }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, topN);
}

/**
 * Findet zusammenhängende Zeitfenster mit maximaler Überschneidung
 */
export function getBestTimeWindows(
  availabilities: Availability[],
  minDays: number = 3
): { from: number; to: number; count: number; names: string[] }[] {
  const overlaps = calculateDayOverlaps(availabilities);
  const windows: { from: number; to: number; count: number; names: string[] }[] = [];

  // Finde alle möglichen Fenster
  for (let start = 1; start <= DAYS_IN_JULY - minDays + 1; start++) {
    for (let end = start + minDays - 1; end <= DAYS_IN_JULY; end++) {
      // Finde Personen die den gesamten Zeitraum verfügbar sind
      const availableNames = new Set<string>();

      for (const availability of availabilities) {
        const fromDay = parseISO(availability.from).getDate();
        const toDay = parseISO(availability.to).getDate();

        if (fromDay <= start && toDay >= end) {
          availableNames.add(availability.name);
        }
      }

      if (availableNames.size > 0) {
        windows.push({
          from: start,
          to: end,
          count: availableNames.size,
          names: Array.from(availableNames),
        });
      }
    }
  }

  // Sortiere nach Anzahl Personen (absteigend), dann nach Länge (absteigend)
  return windows
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return (b.to - b.from) - (a.to - a.from);
    })
    .slice(0, 5);
}

/**
 * Wochentag für einen Juli-Tag
 */
export function getWeekdayForJulyDay(day: number): string {
  const date = new Date(2026, 6, day);
  return format(date, "EEE", { locale: de });
}

