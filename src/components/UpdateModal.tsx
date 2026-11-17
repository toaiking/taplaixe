import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Sparkles, X } from 'lucide-react';

interface UpdateModalProps {
  open: boolean;
  currentCommit: string;
  latestCommit: string;
  isUpdating: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  open,
  currentCommit,
  latestCommit,
  isUpdating,
  onConfirm,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Đóng thông báo cập nhật"
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src="/icons/icon-192-v3.png?v=3"
                  alt="GPLX 600"
                  className="h-16 w-16 rounded-2xl border border-slate-200/80 shadow-md dark:border-slate-700"
                />
                <span className="absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Đã có bản cập nhật mới!
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Ứng dụng <strong>GPLX 600</strong> vừa có bản cập nhật mới. Xác nhận tải lại để áp dụng ngay các cải tiến mới nhất.
              </p>

              {/* Commit comparison */}
              <div className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                <span className="rounded-md bg-slate-200/80 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  #{currentCommit}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  #{latestCommit}
                </span>
              </div>

              <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onDismiss}
                  disabled={isUpdating}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Để sau
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  {isUpdating ? 'Đang cập nhật...' : 'Cập nhật ngay'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
