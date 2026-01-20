import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAvailabilities, addAvailability } from "@/lib/db";
import { validateAvailability } from "@/lib/utils";
import { Availability, ApiResponse } from "@/lib/types";

/**
 * GET /api/availabilities
 * Gibt alle Verfügbarkeiten zurück
 */
export async function GET(): Promise<NextResponse<ApiResponse<Availability[]>>> {
  try {
    const availabilities = await getAvailabilities();
    return NextResponse.json({ success: true, data: availabilities });
  } catch (error) {
    console.error("Fehler beim Laden der Verfügbarkeiten:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Daten" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/availabilities
 * Erstellt eine neue Verfügbarkeit
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Availability>>> {
  try {
    const body = await request.json();
    const { name, from, to } = body;

    // Validierung
    const validation = validateAvailability(name, from, to);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Neue Availability erstellen
    const newAvailability: Availability = {
      id: uuidv4(),
      name: name.trim(),
      from,
      to,
      createdAt: new Date().toISOString(),
    };

    await addAvailability(newAvailability);

    return NextResponse.json(
      { success: true, data: newAvailability },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fehler beim Erstellen der Verfügbarkeit:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Speichern der Daten" },
      { status: 500 }
    );
  }
}
