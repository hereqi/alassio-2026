# 🏖️ Alassio Juli 2026 - Verfügbarkeitsplanung

Eine einfache Web-App zum Planen von Verfügbarkeiten für den Alassio Urlaub im Juli 2026.

## 🚀 Schnellstart

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

```
src/
├── app/
│   ├── eintragen/          # Seite nur zum Eintragen
│   ├── api/                # API Routes
│   └── page.tsx            # Hauptseite (Übersicht)
├── components/             # React Komponenten
└── lib/                    # Utilities & Types
```

## 🔗 Links

- **Zum Eintragen:** `/eintragen` - Einfaches Formular für Kollegen
- **Zur Übersicht:** `/` - Monatsübersicht + Liste aller Einträge

## 💾 Daten

Die Verfügbarkeiten werden in `/data/availabilities.json` gespeichert.

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- date-fns

## 📦 Deployment

Siehe [DEPLOY.md](./DEPLOY.md) für Deployment-Anleitung (Vercel/Netlify).

---

Made with ☀️ für den Alassio Urlaub 2026
