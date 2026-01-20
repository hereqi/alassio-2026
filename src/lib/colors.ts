/**
 * Deterministisch eine Farbe basierend auf dem Namen generieren
 * Nutzt einen einfachen Hash-Algorithmus
 */

// Vordefinierte Tailwind-Farbklassen für gute Sichtbarkeit
const COLORS = [
  { bg: "bg-rose-400", text: "text-rose-900", border: "border-rose-500" },
  { bg: "bg-amber-400", text: "text-amber-900", border: "border-amber-500" },
  { bg: "bg-emerald-400", text: "text-emerald-900", border: "border-emerald-500" },
  { bg: "bg-cyan-400", text: "text-cyan-900", border: "border-cyan-500" },
  { bg: "bg-violet-400", text: "text-violet-900", border: "border-violet-500" },
  { bg: "bg-pink-400", text: "text-pink-900", border: "border-pink-500" },
  { bg: "bg-lime-400", text: "text-lime-900", border: "border-lime-500" },
  { bg: "bg-sky-400", text: "text-sky-900", border: "border-sky-500" },
  { bg: "bg-orange-400", text: "text-orange-900", border: "border-orange-500" },
  { bg: "bg-teal-400", text: "text-teal-900", border: "border-teal-500" },
  { bg: "bg-indigo-400", text: "text-indigo-900", border: "border-indigo-500" },
  { bg: "bg-fuchsia-400", text: "text-fuchsia-900", border: "border-fuchsia-500" },
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

/**
 * Gibt die Farbklassen für einen Namen zurück
 */
export function getColorForName(name: string): {
  bg: string;
  text: string;
  border: string;
} {
  const index = hashString(name.toLowerCase()) % COLORS.length;
  return COLORS[index];
}

/**
 * Alle verfügbaren Farben exportieren (für Legende etc.)
 */
export { COLORS };

