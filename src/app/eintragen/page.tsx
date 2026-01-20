"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AvailabilityInput, ApiResponse } from "@/lib/types";
import { AvailabilityForm } from "@/components/AvailabilityForm";
import { Modal } from "@/components/Modal";
import { Toast, ToastType } from "@/components/Toast";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

/**
 * Seite nur zum Eintragen - für Kollegen
 */
export default function EintragenPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = async (data: AvailabilityInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<any> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Erstellen");
      }

      showToast(`Verfügbarkeit für ${data.name} erfolgreich eingetragen!`, "success");
      
      // Nach 2 Sekunden zur Übersicht weiterleiten
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Fehler beim Speichern",
        "error"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏖️</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 mb-3">
            Alassio Juli 2026
          </h1>
          <p className="text-slate-300 text-lg">
            Trage deine Verfügbarkeit ein
          </p>
        </div>

        {/* Formular */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 sm:p-8">
          <AvailabilityForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
            isLoading={isSubmitting}
          />
        </div>

        {/* Link zur Übersicht */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-amber-400 text-sm transition-colors underline"
          >
            Zur Übersicht →
          </button>
        </div>
      </div>

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

