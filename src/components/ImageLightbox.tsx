import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { hapticTap } from '../utils/haptics';

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

function getTouchDistance(t1: React.Touch, t2: React.Touch): number {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState('50% 50%');

  const lastTapRef = useRef<number>(0);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);
  const panStartRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setOrigin('50% 50%');
    if (!src) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [src, onClose]);

  const handleImageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      pinchStartDistRef.current = getTouchDistance(e.touches[0], e.touches[1]);
      pinchStartScaleRef.current = scale;
      panStartRef.current = null;
      return;
    }

    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        // Double-tap detected -> toggle 2.5x at tap coordinate
        hapticTap();
        if (scale > 1.1) {
          setScale(1);
          setPan({ x: 0, y: 0 });
          setOrigin('50% 50%');
        } else {
          const rect = imgRef.current?.getBoundingClientRect();
          if (rect) {
            const ox = Math.max(
              0,
              Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100)
            );
            const oy = Math.max(
              0,
              Math.min(100, ((e.touches[0].clientY - rect.top) / rect.height) * 100)
            );
            setOrigin(`${ox.toFixed(1)}% ${oy.toFixed(1)}%`);
          }
          setScale(2.5);
          setPan({ x: 0, y: 0 });
        }
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      if (scale > 1.05) {
        panStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          px: pan.x,
          py: pan.y,
        };
      }
    }
  };

  const handleImageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const next = Math.max(1, Math.min(3.5, pinchStartScaleRef.current * (dist / pinchStartDistRef.current)));
      setScale(next);
      return;
    }
    if (e.touches.length === 1 && panStartRef.current && scale > 1.05) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.px + dx,
        y: panStartRef.current.py + dy,
      });
    }
  };

  const handleImageTouchEnd = () => {
    pinchStartDistRef.current = null;
    panStartRef.current = null;
    if (scale <= 1.02) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  };

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          {/* Top Controls */}
          <div
            className="mb-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/95 px-3 py-1.5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setScale((s) => Math.max(1, s - 0.5));
                if (scale - 0.5 <= 1) setPan({ x: 0, y: 0 });
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              title="Thu nhỏ"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3.2rem] text-center font-mono text-xs font-semibold tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(3.5, s + 0.5))}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              title="Phóng to"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
                setOrigin('50% 50%');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              title="Mặc định"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="mx-1 h-4 w-px bg-white/20" />
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-rose-300 transition-colors hover:bg-rose-500/20"
              title="Đóng (Esc / Z)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Swipe-Down to Close container when at 1x */}
          <motion.div
            drag={scale <= 1.05 ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.45}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 400) {
                hapticTap();
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleImageTouchStart}
            onTouchMove={handleImageTouchMove}
            onTouchEnd={handleImageTouchEnd}
            className="relative flex max-h-[78vh] max-w-5xl touch-none items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt || 'Hình minh họa phóng to'}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                transformOrigin: origin,
              }}
              className="max-h-[72vh] w-auto select-none object-contain transition-transform duration-100"
              draggable={false}
            />
          </motion.div>

          <p className="mt-2.5 text-center text-[11px] font-medium text-slate-300">
            Chạm đúp để zoom 2.5x • Chụm 2 ngón để phóng to • Vuốt xuống để đóng
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
