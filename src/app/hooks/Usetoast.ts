import { useState, useCallback } from "react";

export interface ToastMsg {
  id: number;
  type: "success" | "error" | "info";
  text: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const show = useCallback((type: ToastMsg["type"], text: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const dismiss = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  );

  return { toasts, show, dismiss };
}