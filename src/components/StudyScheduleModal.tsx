import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellRing, CalendarPlus, Check, Clock, Smartphone, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PracticeSourceMode } from '../types/question';
import {
  downloadScheduleICS,
  getNotificationPermission,
  isIOSNonStandalone,
  requestNotificationPermission,
  sendStudyNotification,
} from '../utils/scheduler';

interface StudyScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onTestBanner?: () => void;
}

const WEEKDAYS = [
  { id: 1, label: 'T2' },
  { id: 2, label: 'T3' },
  { id: 3, label: 'T4' },
  { id: 4, label: 'T5' },
  { id: 5, label: 'T6' },
  { id: 6, label: 'T7' },
  { id: 0, label: 'CN' },
];

export const StudyScheduleModal: React.FC<StudyScheduleModalProps> = ({
  open,
  onClose,
  onTestBanner,
}) => {
  const { studySchedule, updateStudySchedule } = useAppStore();
  const [perm, setPerm] = useState(getNotificationPermission());
  const [testStatus, setTestStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const iosNeedsInstall = isIOSNonStandalone();

  useEffect(() => {
    if (open) {
      setPerm(getNotificationPermission());
      setTestStatus(null);
    }
  }, [open]);

  const toggleDay = (dayId: number) => {
    const exists = studySchedule.days.includes(dayId);
    const next = exists
      ? studySchedule.days.filter((d) => d !== dayId)
      : [...studySchedule.days, dayId];
    updateStudySchedule({ days: next.length ? next : [dayId], lastNotifiedDate: null });
  };

  const handleEnableToggle = async () => {
    const nextEnabled = !studySchedule.enabled;
    if (nextEnabled) {
      const p = await requestNotificationPermission();
      setPerm(p);
    }
    updateStudySchedule({ enabled: nextEnabled, lastNotifiedDate: null });
  };

  const handleTestNotification = async () => {
    const p = await requestNotificationPermission();
    setPerm(p);

    const res = await sendStudyNotification(
      'Đến giờ ôn thi GPLX 600 Câu!',
      `Mục tiêu hôm nay: ${studySchedule.dailyGoal} câu. Bấm để vào ôn tập ngay.`
    );

    if (onTestBanner) {
      onTestBanner();
    }

    if (res.sentOS) {
      setTestStatus({
        ok: true,
        msg: 'Đã phát chuông báo + gửi thông báo hệ thống thành công!',
      });
    } else if (iosNeedsInstall) {
      setTestStatus({
        ok: true,
        msg: 'Đã phát âm báo & banner trong app! Trên iPhone, hãy chọn "Chia sẻ → Thêm vào MH chính" hoặc bấm "Lưu vào Lịch máy" bên dưới để nhận báo thức nền.',
      });
    } else if (p === 'denied') {
      setTestStatus({
        ok: false,
        msg: 'Đã phát âm báo & banner trong app, nhưng trình duyệt đang chặn thông báo đẩy. Hãy bật quyền Thông báo ở thanh địa chỉ hoặc dùng nút "Lưu vào Lịch máy".',
      });
    } else {
      setTestStatus({
        ok: true,
        msg: 'Đã phát âm báo & hiển thị nhắc nhở trong ứng dụng!',
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Lịch Ôn Tập &amp; Nhắc Nhở
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hoạt động trên cả máy tính và điện thoại
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Toggle Enable */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Bật tự động nhắc giờ học
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Trạng thái trình duyệt:{' '}
                    <span className="font-mono font-semibold">
                      {perm === 'granted'
                        ? 'Đã cấp phép'
                        : perm === 'denied'
                          ? 'Đang chặn'
                          : perm === 'unsupported'
                            ? 'Chế độ chuông trong app'
                            : 'Chưa cấp phép'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={studySchedule.enabled}
                  onClick={handleEnableToggle}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    studySchedule.enabled
                      ? 'bg-slate-900 dark:bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      studySchedule.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* iOS helper notice */}
              {iosNeedsInstall && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Mẹo trên iPhone/iPad:</strong> Chọn <em>Chia sẻ → Thêm vào MH chính</em> để nhận thông báo đẩy iOS, hoặc bấm nút <strong>Lưu vào Lịch máy (.ics)</strong> bên dưới để báo thức ngay cả khi tắt trình duyệt.
                  </span>
                </div>
              )}

              {/* Time & Daily Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5" /> Giờ nhắc nhở
                  </label>
                  <input
                    type="time"
                    value={studySchedule.time}
                    onChange={(e) =>
                      updateStudySchedule({
                        time: e.target.value,
                        lastNotifiedDate: null,
                        enabled: true,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Mục tiêu mỗi buổi
                  </label>
                  <select
                    value={studySchedule.dailyGoal}
                    onChange={(e) =>
                      updateStudySchedule({ dailyGoal: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value={15}>15 câu / ngày</option>
                    <option value={25}>25 câu / ngày</option>
                    <option value={40}>40 câu / ngày</option>
                    <option value={60}>60 câu / ngày</option>
                  </select>
                </div>
              </div>

              {/* Days of Week */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Các ngày trong tuần
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map((d) => {
                    const active = studySchedule.days.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-slate-900 text-white dark:bg-indigo-600'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Mode */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Nội dung ưu tiên khi ôn
                </label>
                <select
                  value={studySchedule.focusMode}
                  onChange={(e) =>
                    updateStudySchedule({
                      focusMode: e.target.value as PracticeSourceMode,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="srs">Ôn tập thông minh (SRS)</option>
                  <option value="critical">60 Câu Điểm Liệt</option>
                  <option value="pinned">Câu đã ghim</option>
                  <option value="wrong">Ngân hàng câu hay sai</option>
                </select>
              </div>

              {/* Native OS Calendar / Alarm Sync (.ics) */}
              <button
                type="button"
                onClick={() =>
                  downloadScheduleICS(
                    studySchedule.time,
                    studySchedule.days,
                    studySchedule.dailyGoal
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100/80 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                <CalendarPlus className="h-4 w-4" />
                Lưu vào Lịch điện thoại / Máy tính (.ics) để báo khi tắt máy
              </button>

              {testStatus && (
                <div
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium leading-relaxed ${
                    testStatus.ok
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200'
                  }`}
                >
                  {testStatus.msg}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <BellRing className="h-3.5 w-3.5 text-indigo-600" />
                  Gửi thông báo thử
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-indigo-600"
                >
                  <Check className="h-3.5 w-3.5" />
                  Hoàn tất
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
