"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useEffect, useState } from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      style={
        {
          // Base toast styling - premium glass morphism
          "--toast-bg": "rgba(255, 255, 255, 0.95)",
          "--toast-bg-dark": "rgba(23, 25, 35, 0.95)",
          "--normal-bg": "rgba(255, 255, 255, 0.95)",
          "--normal-text": "#1e293b",
          "--normal-border": "rgba(226, 232, 240, 0.6)",

          // Success - refined green with subtle gradient
          "--success-bg": "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          "--success-bg-dark": "linear-gradient(135deg, #14532d 0%, #166534 100%)",
          "--success-text": "#14532d",
          "--success-text-dark": "#f0fdf4",
          "--success-border": "rgba(34, 197, 94, 0.3)",

          // Error - refined red with subtle gradient
          "--error-bg": "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
          "--error-bg-dark": "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
          "--error-text": "#7f1d1d",
          "--error-text-dark": "#fef2f2",
          "--error-border": "rgba(239, 68, 68, 0.3)",

          // Warning - refined amber with subtle gradient
          "--warning-bg": "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          "--warning-bg-dark": "linear-gradient(135deg, #854d0e 0%, #92400e 100%)",
          "--warning-text": "#854d0e",
          "--warning-text-dark": "#fffbeb",
          "--warning-border": "rgba(245, 158, 11, 0.3)",

          // Info - refined blue with subtle gradient
          "--info-bg": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          "--info-bg-dark": "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
          "--info-text": "#1e3a8a",
          "--info-text-dark": "#eff6ff",
          "--info-border": "rgba(59, 130, 246, 0.3)",

          // Premium styling tokens
          "--radius": "16px",
          "--shadow": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05) inset",
          "--shadow-dark": "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          "--padding": "1rem 1.5rem",
          "--gap": "0.75rem",
          "--animation-duration": "0.4s",
          "--font-family": "inherit",
          "--font-size": "0.9375rem",
          "--font-weight": "500",
          "--line-height": "1.5",

          // Additional premium touches
          "--backdrop-blur": "8px",
          "--border-width": "1px",
          "--border-style": "solid",
          "--opacity": "0.98",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: "group toast-premium backdrop-blur-[--backdrop-blur] shadow-[--shadow] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          title: "font-semibold tracking-tight",
          description: "text-sm opacity-80 mt-1",
          actionButton: "bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors",
          cancelButton: "bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors",
          closeButton: "absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
          icon: "flex-shrink-0",
          content: "flex-1",
        },
      }}
      position="top-right"
      expand={false}
      visibleToasts={6}
      closeButton
      {...props} // Spread props last to allow overrides but avoid duplicates
    />
  );
};

export { Toaster };