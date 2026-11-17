import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { hapticTap } from '../utils/haptics';

interface BottomSheetProps {
  open: boolean;
  title: string;
  expandable?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  title,
  expandable = true,
  onClose,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end bg-slate-950/60 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            style={{ height: expandable ? (expanded ? '90vh' : '52vh') : 'auto' }}
            className="flex max-h-[90vh] w-full flex-col rounded-t-3xl border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] transition-[height] duration-200 dark:border-slate-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle Bar + Header */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.y < -45 && expandable && !expanded) {
                  hapticTap();
                  setExpanded(true);
                } else if (info.offset.y > 55) {
                  hapticTap();
                  if (expanded) {
                    setExpanded(false);
                  } else {
                    onClose();
                  }
                }
              }}
              className="shrink-0 cursor-grab touch-none px-4 pt-1 pb-2.5 active:cursor-grabbing"
            >
              <div className="mx-auto my-2 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </span>
                <div className="flex items-center gap-1.5">
                  {expandable && (
                    <button
                      type="button"
                      onClick={() => {
                        hapticTap();
                        setExpanded((v) => !v);
                      }}
                      className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {expanded ? (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" /> Thu gọn
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" /> Mở rộng (90%)
                        </>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
