export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function isIOSNonStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIOS && !standalone;
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const result = await new Promise<NotificationPermission>((resolve) => {
      const maybePromise = Notification.requestPermission((perm) => resolve(perm));
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(resolve).catch(() => resolve(Notification.permission));
      }
    });
    return result;
  } catch {
    return Notification.permission;
  }
}

export function playReminderChime(): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([120, 60, 120]);
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5 pleasant chime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  } catch {
    // Ignore audio context restrictions
  }
}

export async function sendStudyNotification(
  title: string,
  body: string
): Promise<{ sentOS: boolean; reason?: string }> {
  playReminderChime();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { sentOS: false, reason: 'unsupported' };
  }
  if (Notification.permission !== 'granted') {
    return { sentOS: false, reason: Notification.permission };
  }

  // 1. Prefer ServiceWorkerRegistration.showNotification (required on Android Chrome & mobile PWAs)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.active) {
        await reg.showNotification(title, {
          body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: 'gplx-study-reminder',
          renotify: true,
        } as NotificationOptions);
        return { sentOS: true };
      }
    }
  } catch {
    // Fallback to window.Notification below
  }

  // 2. Fallback to standard Desktop Notification constructor
  try {
    const n = new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      tag: 'gplx-study-reminder',
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return { sentOS: true };
  } catch {
    return { sentOS: false, reason: 'failed' };
  }
}

export function getTodayStr(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

export function isScheduleDueNow(
  timeStr: string,
  days: number[],
  lastNotifiedDate: string | null,
  now = new Date()
): boolean {
  const day = now.getDay();
  if (!days.includes(day)) return false;

  const todayStr = getTodayStr(now);
  if (lastNotifiedDate === todayStr) return false;

  const parts = timeStr.split(':');
  if (parts.length !== 2) return false;
  const targetH = parseInt(parts[0], 10);
  const targetM = parseInt(parts[1], 10);
  if (isNaN(targetH) || isNaN(targetM)) return false;

  const targetTotalMin = targetH * 60 + targetM;
  const nowTotalMin = now.getHours() * 60 + now.getMinutes();

  // Trigger if current time is at or after target time (up to 4 hours catch-up window for mobile sleep/wake)
  return nowTotalMin >= targetTotalMin && nowTotalMin - targetTotalMin <= 240;
}

export function downloadScheduleICS(
  timeStr: string,
  days: number[],
  dailyGoal: number
): void {
  const dayMap: Record<number, string> = {
    0: 'SU',
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA',
  };
  const byDay = days.map((d) => dayMap[d]).filter(Boolean).join(',') || 'MO,TU,WE,TH,FR,SA,SU';
  const [hh, mm] = timeStr.split(':').map((x) => parseInt(x, 10) || 0);

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hh,
    mm,
    0
  );
  const end = new Date(start.getTime() + 20 * 60000);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(
      d.getMinutes()
    ).padStart(2, '0')}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GPLX 600 Cau 2025//VN',
    'BEGIN:VEVENT',
    `UID:gplx600-${Date.now()}@taplaixe`,
    `DTSTAMP:${fmt(now)}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${byDay}`,
    `SUMMARY:Ôn thi GPLX 600 Câu (${dailyGoal} câu)`,
    `DESCRIPTION:Đến giờ luyện ${dailyGoal} câu hỏi lý thuyết lái xe chuẩn Cục CSGT 2025.`,
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Đến giờ ôn thi GPLX 600 Câu!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lich-on-tap-gplx-600.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
