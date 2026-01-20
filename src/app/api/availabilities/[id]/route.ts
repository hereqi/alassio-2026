import { NextRequest, NextResponse } from "next/server";
import {
  findAvailabilityById,
  updateAvailability,
  deleteAvailability,
} from "@/lib/storage";
import { validateAvailability } from "@/lib/utils";
import { Availability, ApiResponse } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/availabilities/:id
 * Gibt eine einzelne Verfügbarkeit zurück
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Availability>>> {
  try {
    const { id } = await context.params;
    const availability = await findAvailabilityById(id);

    if (!availability) {
      return NextResponse.json(
        { success: false, error: "Verfügbarkeit nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error("Fehler beim Laden der Verfügbarkeit:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Daten" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/availabilities/:id
 * Aktualisiert eine Verfügbarkeit
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Availability>>> {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, from, to } = body;

    // Prüfen ob Eintrag existiert
    const existing = await findAvailabilityById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Verfügbarkeit nicht gefunden" },
        { status: 404 }
      );
    }

    // Validierung
    const validation = validateAvailability(name, from, to);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update durchführen
    const updated = await updateAvailability(id, {
      name: name.trim(),
      from,
      to,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Fehler beim Aktualisieren" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Verfügbarkeit:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren der Daten" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/availabilities/:id
 * Löscht eine Verfügbarkeit
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await context.params;
    const deleted = await deleteAvailability(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Verfügbarkeit nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Fehler beim Löschen der Verfügbarkeit:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen der Daten" },
      { status: 500 }
    );
  }
}

