import React from "react";
import { CheckCheck, AlertCircle, Info, X } from "lucide-react";
import { ToastMsg } from "../../hooks/Usetoast";

interface Props {
  toasts: ToastMsg[];
  onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, onDismiss }: Props) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-28 right-5 z-50 flex flex-col gap-2.5 lg:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-[280px]
            ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-rose-600" : "bg-neutral-900"}`}
          style={{ animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {t.type === "success" ? (
            <CheckCheck className="w-4 h-4 shrink-0" />
          ) : t.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Info className="w-4 h-4 shrink-0" />
          )}
          <span className="flex-1 text-[13px]">{t.text}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}