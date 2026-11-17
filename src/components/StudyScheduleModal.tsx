import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellRing, Check, Clock, Send, Smartphone, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PracticeSourceMode } from '../types/question';
import {
  getNotificationPermission,
  isIOSNonStandalone,
  requestNotificationPermission,
  scheduleBackgroundNotification,
  sendStudyNotification,
  syncScheduleWithBackground,
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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const iosNeedsInstall = isIOSNonStandalone();

  useEffect(() => {
    if (open) {
      setPerm(getNotificationPermission());
      setTestStatus(null);
      setCountdown(null);
      setIsSaving(false);
    }
  }, [open]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const id = window.setTimeout(() => {
      setCountdown((c) => (c !== null && c > 1 ? c - 1 : null));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  const toggleDay = (dayId: number) => {
    const exists = studySchedule.days.includes(dayId);
    const next = exists
      ? studySchedule.days.filter((d) => d !== dayId)
      : [...studySchedule.days, dayId];
    const updated = {
      ...studySchedule,
      days: next.length ? next : [dayId],
      lastNotifiedDate: null,
    };
    updateStudySchedule({ days: updated.days, lastNotifiedDate: null });
    syncScheduleWithBackground(updated, true);
  };

  const handleEnableToggle = async () => {
    const nextEnabled = !studySchedule.enabled;
    if (nextEnabled) {
      const p = await requestNotificationPermission();
      setPerm(p);
    }
    const updated = {
      ...studySchedule,
      enabled: nextEnabled,
      lastNotifiedDate: null,
    };
    updateStudySchedule({ enabled: nextEnabled, lastNotifiedDate: null });
    await syncScheduleWithBackground(updated, true);
  };

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    try {
      const p = await requestNotificationPermission();
      setPerm(p);
      const updated = {
        ...studySchedule,
        enabled: true,
        lastNotifiedDate: null,
      };
      updateStudySchedule({ enabled: true, lastNotifiedDate: null });
      await syncScheduleWithBackground(updated, true);
    } finally {
      setIsSaving(false);
      onClose();
    }
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
        msg: 'Đã phát chuông báo + gửi thông báo đẩy trực tiếp lên thiết bị thành công!',
      });
    } else if (iosNeedsInstall) {
      setTestStatus({
        ok: true,
        msg: 'Đã phát chuông báo! Trên iPhone, hãy bấm nút "Cài App" (Chia sẻ → Thêm vào MH chính) để iOS cho phép gửi thông báo khi thoát ứng dụng.',
      });
    } else if (p === 'denied') {
      setTestStatus({
        ok: false,
        msg: 'Quyền thông báo đang bị chặn trên trình duyệt. Hãy bấm biểu tượng ổ khóa trên thanh địa chỉ → Bật Thông báo để nhận khi đóng App.',
      });
    } else {
      setTestStatus({
        ok: true,
        msg: 'Đã phát chuông báo & hiển thị nhắc nhở trực tiếp!',
      });
    }
  };

  const handleBackgroundTest5s = async () => {
    const p = await requestNotificationPermission();
    setPerm(p);

    if (p !== 'granted') {
      setTestStatus({
        ok: false,
        msg: iosNeedsInstall
          ? 'Trên iPhone/iPad, bạn cần cài ứng dụng ra Màn hình chính (Chia sẻ → Thêm vào MH chính) rồi mở lại từ Màn hình chính để bật thông báo ngầm.'
          : 'Vui lòng bấm "Cho phép" quyền Thông báo trên trình duyệt để nhận thông báo khi đóng ứng dụng.',
      });
      return;
    }

    setCountdown(5);
    await scheduleBackgroundNotification(
      '🔔 Thông báo ngầm GPLX 600 Câu!',
      `Hoạt động tốt cả khi đóng App! Mục tiêu: ${studySchedule.dailyGoal} câu/ngày.`,
      5000,
      `test5s_${Date.now()}`
    );

    setTestStatus({
      ok: true,
      msg: 'Đã hẹn gửi thông báo đẩy sau 5 giây! Bạn hãy thoát ra Màn hình chính hoặc khóa màn hình điện thoại ngay bây giờ để kiểm tra.',
    });
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
                    Gửi thông báo đẩy (Web Push) kể cả khi đóng ứng dụng
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
                    Trạng thái thông báo đẩy:{' '}
                    <span className="font-mono font-semibold">
                      {perm === 'granted'
                        ? 'Đã kết nối Web Push'
                        : perm === 'denied'
                          ? 'Đang bị chặn quyền'
                          : perm === 'unsupported'
                            ? 'Báo chuông trong app'
                            : 'Chờ cấp quyền'}
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
                    <strong>Lưu ý trên iPhone/iPad:</strong> Để nhận thông báo khi đã đóng trình duyệt, iOS yêu cầu bạn bấm nút <strong>Cài App</strong> trên thanh đầu trang (hoặc <em>Chia sẻ → Thêm vào MH chính</em>) rồi mở App từ màn hình chính.
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
                    onChange={async (e) => {
                      const nextTime = e.target.value;
                      const updated = {
                        ...studySchedule,
                        time: nextTime,
                        lastNotifiedDate: null,
                        enabled: true,
                      };
                      updateStudySchedule({
                        time: nextTime,
                        lastNotifiedDate: null,
                        enabled: true,
                      });
                      const p = await requestNotificationPermission();
                      setPerm(p);
                      const res = await syncScheduleWithBackground(updated, true);
                      if (res.synced) {
                        setTestStatus({
                          ok: true,
                          msg: `Đã đồng bộ lịch nhắc lúc ${nextTime} lên máy chủ đẩy! Bạn có thể đóng ứng dụng.`,
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Mục tiêu mỗi buổi
                  </label>
                  <select
                    value={studySchedule.dailyGoal}
                    onChange={(e) => {
                      const goal = Number(e.target.value);
                      const updated = {
                        ...studySchedule,
                        dailyGoal: goal,
                        lastNotifiedDate: null,
                      };
                      updateStudySchedule({ dailyGoal: goal, lastNotifiedDate: null });
                      syncScheduleWithBackground(updated, true);
                    }}
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

              {/* Test buttons row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <BellRing className="h-3.5 w-3.5 text-indigo-600" />
                  Thử ngay lập tức
                </button>
                <button
                  type="button"
                  onClick={handleBackgroundTest5s}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-300"
                >
                  <Send className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  {countdown ? `Đóng App ngay (${countdown}s)...` : 'Thử khi đóng App (5s)'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAndClose}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-70 dark:bg-indigo-600"
              >
                <Check className="h-3.5 w-3.5" />
                {isSaving ? 'Đang đồng bộ lịch ngầm...' : 'Lưu lịch ôn tập'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
