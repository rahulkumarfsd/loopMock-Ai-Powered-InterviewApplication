import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative z-10 w-full ${maxWidth} bg-bg-2 border border-border rounded-2xl p-6 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#4a4a5a] hover:text-white transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}