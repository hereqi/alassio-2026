/**
 * Deterministisch eine Farbe basierend auf dem Namen generieren
 * Sehr unterschiedliche, kräftige Farben für maximale Unterscheidbarkeit
 */

// Maximale Unterscheidbarkeit: Kontrastreiche, kräftige Farben
const COLORS = [
  { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  { bg: "bg-green-500", text: "text-white", border: "border-green-600" },
  { bg: "bg-yellow-400", text: "text-black", border: "border-yellow-500" },
  { bg: "bg-purple-500", text: "text-white", border: "border-purple-600" },
  { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" },
  { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  { bg: "bg-cyan-400", text: "text-black", border: "border-cyan-500" },
  { bg: "bg-lime-400", text: "text-black", border: "border-lime-500" },
  { bg: "bg-indigo-500", text: "text-white", border: "border-indigo-600" },
  { bg: "bg-rose-500", text: "text-white", border: "border-rose-600" },
  { bg: "bg-teal-500", text: "text-white", border: "border-teal-600" },
];

/**
 * Einfacher String-Hash
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Cache für zugewiesene Farben (nach Reihenfolge)
const assignedColors = new Map<string, number>();
let nextColorIndex = 0;

/**
 * Gibt die Farbklassen für einen Namen zurück
 * Weist Farben in Reihenfolge zu für maximale Unterscheidbarkeit
 */
export function getColorForName(name: string): {
  bg: string;
  text: string;
  border: string;
} {
  const key = name.toLowerCase().trim();
  
  if (!assignedColors.has(key)) {
    assignedColors.set(key, nextColorIndex % COLORS.length);
    nextColorIndex++;
  }
  
  const index = assignedColors.get(key)!;
  return COLORS[index];
}

/**
 * Reset der Farbzuweisung (für Tests)
 */
export function resetColors() {
  assignedColors.clear();
  nextColorIndex = 0;
}

/**
 * Alle verfügbaren Farben exportieren (für Legende etc.)
 */
export { COLORS };
