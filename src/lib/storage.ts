import { promises as fs } from "fs";
import path from "path";
import { Availability } from "./types";

/**
 * Pfad zur JSON-Datei im data-Verzeichnis
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "availabilities.json");

/**
 * Stellt sicher, dass das data-Verzeichnis existiert
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Liest die JSON-Datei und gibt die Availabilities zurück
 * Erstellt eine leere Datei wenn sie nicht existiert
 */
export async function readAvailabilities(): Promise<Availability[]> {
  await ensureDataDir();

  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Datei existiert nicht oder ist leer -> leeres Array zurückgeben
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeAvailabilities([]);
      return [];
    }
    console.error("Fehler beim Lesen der Datei:", error);
    return [];
  }
}

/**
 * Schreibt die Availabilities in die JSON-Datei
 * Einfaches Lock-Mechanismus mit Retry
 */
export async function writeAvailabilities(
  availabilities: Availability[]
): Promise<void> {
  await ensureDataDir();

  const maxRetries = 3;
  const retryDelay = 100;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Atomisches Schreiben: erst in temp-Datei, dann umbenennen
      const tempFile = `${DATA_FILE}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(availabilities, null, 2));
      await fs.rename(tempFile, DATA_FILE);
      return;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      // Kurz warten und erneut versuchen
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

/**
 * Fügt eine neue Availability hinzu
 */
export async function addAvailability(
  availability: Availability
): Promise<Availability> {
  const availabilities = await readAvailabilities();
  availabilities.push(availability);
  await writeAvailabilities(availabilities);
  return availability;
}

/**
 * Aktualisiert eine bestehende Availability
 */
export async function updateAvailability(
  id: string,
  updates: Partial<Omit<Availability, "id" | "createdAt">>
): Promise<Availability | null> {
  const availabilities = await readAvailabilities();
  const index = availabilities.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  availabilities[index] = { ...availabilities[index], ...updates };
  await writeAvailabilities(availabilities);
  return availabilities[index];
}

/**
 * Löscht eine Availability
 */
export async function deleteAvailability(id: string): Promise<boolean> {
  const availabilities = await readAvailabilities();
  const filtered = availabilities.filter((a) => a.id !== id);

  if (filtered.length === availabilities.length) {
    return false; // Nicht gefunden
  }

  await writeAvailabilities(filtered);
  return true;
}

/**
 * Findet eine Availability by ID
 */
export async function findAvailabilityById(
  id: string
): Promise<Availability | null> {
  const availabilities = await readAvailabilities();
  return availabilities.find((a) => a.id === id) || null;
}

