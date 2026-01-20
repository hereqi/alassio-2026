import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Alassio Juli 2026 | Verfügbarkeitsplanung",
  description:
    "Plane deinen Urlaub in Alassio! Trage deine Verfügbarkeit für Juli 2026 ein und finde die besten Zeitfenster mit deinen Freunden.",
  keywords: ["Alassio", "Urlaub", "Juli 2026", "Verfügbarkeit", "Planung"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={outfit.variable}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  );
}
