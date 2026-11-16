import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface LightboxModalProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(1);
    if (!src) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative flex max-h-[92vh] max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls */}
            <div className="mb-3 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1.5 text-white shadow-lg ring-1 ring-white/15">
              <button
                onClick={() => setScale((s) => Math.max(0.75, s - 0.25))}
                className="rounded-full p-1.5 hover:bg-white/15"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-[3.2rem] text-center text-xs font-semibold">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
                className="rounded-full p-1.5 hover:bg-white/15"
                title="Phóng to"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="rounded-full p-1.5 hover:bg-white/15"
                title="Mặc định"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <div className="mx-1 h-4 w-px bg-white/20" />
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-rose-300 hover:bg-rose-500/20"
                title="Đóng (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Fixed white canvas so signs never lose color accuracy */}
            <div className="overflow-auto rounded-2xl bg-white p-4 shadow-2xl">
              <img
                src={src}
                alt={alt || 'Hình minh họa phóng to'}
                style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                className="max-h-[76vh] w-auto object-contain transition-transform duration-150"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
