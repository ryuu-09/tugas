import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

let toastId = 0;
const listeners: Set<(toast: ToastMessage) => void> = new Set();

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
  const id = `toast-${toastId++}`;
  const toast: ToastMessage = { id, type, message, duration };
  listeners.forEach(listener => listener(toast));
};

export const Toast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      if (toast.duration) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
      }
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg text-white font-semibold shadow-lg
            animate-slideUp pointer-events-auto
            ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                  ? 'bg-red-500'
                  : 'bg-purple-500'
            }
          `}
        >
          {toast.type === 'success' && '✅ '}
          {toast.type === 'error' && '❌ '}
          {toast.type === 'info' && 'ℹ️ '}
          {toast.message}
        </div>
      ))}
    </div>
  );
};
