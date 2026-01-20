import { sql } from "@vercel/postgres";
import { Availability } from "./types";

/**
 * Initialisiert die Datenbank-Tabelle falls sie nicht existiert
 */
export async function initDatabase(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS availabilities (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      from_date DATE NOT NULL,
      to_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

/**
 * Liest alle Verfügbarkeiten aus der Datenbank
 */
export async function getAvailabilities(): Promise<Availability[]> {
  try {
    await initDatabase();
    
    const { rows } = await sql`
      SELECT id, name, from_date, to_date, created_at 
      FROM availabilities 
      ORDER BY created_at DESC
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      from: row.from_date.toISOString().split("T")[0],
      to: row.to_date.toISOString().split("T")[0],
      createdAt: row.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}

/**
 * Fügt eine neue Verfügbarkeit hinzu
 */
export async function addAvailability(
  availability: Availability
): Promise<Availability> {
  await initDatabase();
  
  await sql`
    INSERT INTO availabilities (id, name, from_date, to_date, created_at)
    VALUES (${availability.id}, ${availability.name}, ${availability.from}, ${availability.to}, ${availability.createdAt})
  `;

  return availability;
}

/**
 * Aktualisiert eine bestehende Verfügbarkeit
 */
export async function updateAvailability(
  id: string,
  updates: { name?: string; from?: string; to?: string }
): Promise<Availability | null> {
  await initDatabase();

  const { rows } = await sql`
    UPDATE availabilities 
    SET name = COALESCE(${updates.name}, name),
        from_date = COALESCE(${updates.from}, from_date),
        to_date = COALESCE(${updates.to}, to_date)
    WHERE id = ${id}
    RETURNING id, name, from_date, to_date, created_at
  `;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    from: row.from_date.toISOString().split("T")[0],
    to: row.to_date.toISOString().split("T")[0],
    createdAt: row.created_at.toISOString(),
  };
}

/**
 * Löscht eine Verfügbarkeit
 */
export async function deleteAvailability(id: string): Promise<boolean> {
  await initDatabase();

  const { rowCount } = await sql`
    DELETE FROM availabilities WHERE id = ${id}
  `;

  return (rowCount ?? 0) > 0;
}

/**
 * Findet eine Verfügbarkeit by ID
 */
export async function findAvailabilityById(
  id: string
): Promise<Availability | null> {
  await initDatabase();

  const { rows } = await sql`
    SELECT id, name, from_date, to_date, created_at 
    FROM availabilities 
    WHERE id = ${id}
  `;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    from: row.from_date.toISOString().split("T")[0],
    to: row.to_date.toISOString().split("T")[0],
    createdAt: row.created_at.toISOString(),
  };
}

