# 🚀 Deployment-Anleitung

## Option 1: Vercel (Empfohlen - am einfachsten)

### Schritt 1: GitHub Repository erstellen

```bash
cd /Users/eqi/Developer/alassio
git init
git add .
git commit -m "Initial commit"
```

Dann auf GitHub:
1. Neues Repository erstellen (z.B. `alassio-2026`)
2. Repository-URL kopieren
3. Lokal verbinden:

```bash
git remote add origin https://github.com/DEIN-USERNAME/alassio-2026.git
git branch -M main
git push -u origin main
```

### Schritt 2: Auf Vercel deployen

1. Gehe zu [vercel.com](https://vercel.com)
2. Mit GitHub einloggen
3. "Add New Project" → Repository auswählen
4. Framework Preset: **Next.js** (wird automatisch erkannt)
5. Root Directory: `./` (Standard)
6. Build Command: `pnpm build` (oder `npm run build`)
7. Output Directory: `.next` (Standard)
8. **Deploy!**

✅ Fertig! Du bekommst einen Link wie: `https://alassio-2026.vercel.app`

### ⚠️ WICHTIG: JSON-Datei Problem

**Das Problem:** Vercel hat ein read-only Dateisystem. Die JSON-Datei wird beim Deployment nicht gespeichert/geschrieben.

**Lösungen:**

**Option A: Für Demo/Test (temporär)**
- Funktioniert für kurze Zeit, aber Daten gehen bei jedem Deployment verloren
- Gut zum Testen ob alles läuft

**Option B: Einfache Datenbank (später)**
- Vercel Postgres (kostenlos)
- Oder Supabase (kostenlos)
- Oder MongoDB Atlas (kostenlos)

Für jetzt: **Einfach deployen und testen!** Die App funktioniert, nur die Persistenz ist auf Vercel nicht zuverlässig.

---

## Option 2: Netlify

1. Gehe zu [netlify.com](https://netlify.com)
2. Mit GitHub einloggen
3. "Add new site" → "Import an existing project"
4. Repository auswählen
5. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
6. **Deploy!**

✅ Fertig! Du bekommst einen Link wie: `https://alassio-2026.netlify.app`

**Gleiches Problem:** JSON-Datei funktioniert nicht zuverlässig.

---

## Option 3: Lokaler Server (für echte Nutzung)

Wenn du einen eigenen Server hast:

```bash
# Build erstellen
pnpm build

# Production Server starten
pnpm start
```

Dann Port 3000 freigeben (Port Forwarding) oder über einen Tunnel (z.B. ngrok) teilen.

---

## 📝 Quick Start für Vercel

```bash
# 1. Git initialisieren (falls noch nicht geschehen)
cd /Users/eqi/Developer/alassio
git init
git add .
git commit -m "Initial commit"

# 2. GitHub Repository erstellen und pushen
# (mach das manuell auf github.com)

# 3. Vercel CLI installieren (optional)
pnpm add -g vercel

# 4. Oder einfach auf vercel.com gehen und GitHub-Repo verbinden
```

---

## 🔗 Deine zwei Links nach Deployment:

1. **Zum Eintragen:** `https://deine-app.vercel.app/eintragen`
2. **Zur Übersicht:** `https://deine-app.vercel.app/`

---

## 💡 Tipp

Für eine **echte Lösung** mit persistenter Datenbank:
- Vercel Postgres (kostenlos für kleine Apps)
- Oder Supabase (kostenlos, sehr einfach)
- Oder einfach auf einem eigenen Server hosten

Aber für jetzt: **Einfach deployen und testen!** 🚀

