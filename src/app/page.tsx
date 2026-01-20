"use client";

import { useState, useEffect, useCallback } from "react";
import { Availability, AvailabilityInput, ApiResponse } from "@/lib/types";
import { AvailabilityForm } from "@/components/AvailabilityForm";
import { AvailabilityList } from "@/components/AvailabilityList";
import { AvailabilityTable } from "@/components/AvailabilityTable";
import { Modal } from "@/components/Modal";
import { Toast, ToastType } from "@/components/Toast";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

export default function Home() {
  // State
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal State (nur für Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Toast Helper
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Daten laden
  const fetchAvailabilities = useCallback(async () => {
    try {
      const response = await fetch("/api/availabilities");
      const data: ApiResponse<Availability[]> = await response.json();

      if (data.success && data.data) {
        // Nach createdAt sortieren (neueste zuerst)
        setAvailabilities(
          data.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      showToast("Fehler beim Laden der Daten", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]);

  // Neue Verfügbarkeit erstellen
  const handleCreate = async (data: AvailabilityInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<Availability> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Erstellen");
      }

      await fetchAvailabilities();
      setIsModalOpen(false);
      setEditingAvailability(null);
      showToast(`Verfügbarkeit für ${data.name} eingetragen!`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Fehler beim Speichern",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verfügbarkeit aktualisieren
  const handleUpdate = async (data: AvailabilityInput) => {
    if (!editingAvailability) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/availabilities/${editingAvailability.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result: ApiResponse<Availability> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Aktualisieren");
      }

      await fetchAvailabilities();
      setIsModalOpen(false);
      setEditingAvailability(null);
      showToast("Änderungen gespeichert!", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Fehler beim Aktualisieren",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verfügbarkeit löschen
  const handleDelete = async (id: string) => {
    if (!confirm("Möchtest du diesen Eintrag wirklich löschen?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/availabilities/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Löschen");
      }

      await fetchAvailabilities();
      showToast("Eintrag gelöscht", "info");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Fehler beim Löschen",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Edit Modal öffnen
  const openEditModal = (availability: Availability) => {
    setEditingAvailability(availability);
    setIsModalOpen(true);
  };

  // Modal schließen
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAvailability(null);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            {/* Emoji Decoration */}
            <div className="text-5xl sm:text-6xl mb-4">🏖️</div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 mb-4">
              Alassio Juli 2026
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6">
              Übersicht aller Verfügbarkeiten
            </p>

            {/* CTA Button */}
            <a
              href="/eintragen"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-full hover:from-amber-300 hover:to-orange-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all shadow-lg shadow-amber-500/25"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Neue Verfügbarkeit eintragen
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400">Lade Verfügbarkeiten...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Monatsübersicht */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">
                  📅 Monatsübersicht Juli 2026
                </h2>
                <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-400">
                  {availabilities.length} Einträge
                </span>
              </div>
              <AvailabilityTable availabilities={availabilities} />
            </section>

            {/* Einträge Liste */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  👥 Alle Einträge
                </h2>
                <a
                  href="/eintragen"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Hinzufügen
                </a>
              </div>
              <AvailabilityList
                availabilities={availabilities}
                onEdit={openEditModal}
                onDelete={handleDelete}
                isDeleting={deletingId}
              />
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>
          Made with ☀️ für den Alassio Urlaub 2026
        </p>
      </footer>

      {/* Modal für Formular */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingAvailability
            ? "Verfügbarkeit bearbeiten"
            : "Neue Verfügbarkeit"
        }
      >
        <AvailabilityForm
          onSubmit={editingAvailability ? handleUpdate : handleCreate}
          onCancel={closeModal}
          initialData={editingAvailability || undefined}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </main>
  );
}
