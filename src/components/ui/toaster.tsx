"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[300px] rounded-lg shadow-lg p-4 animate-in slide-in-from-top-5
            ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200"
            }
          `}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="text-sm mt-1 opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
