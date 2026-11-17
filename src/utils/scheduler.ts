import { StudySchedule } from '../types/question';

const VAPID_PUBLIC_KEY =
  'BLiQuh0I2fR3ziFUixidbyvCxPwpJPDtYKdWCuyOqMMosIM1Wz-axwHitBxBdx5IdLPUOTNvoQA6k2inRCwJ4eI';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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

export async function ensurePushSubscription(): Promise<PushSubscription | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }
  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey.buffer as ArrayBuffer,
      });
    }
    return sub;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    await ensurePushSubscription();
    return 'granted';
  }
  try {
    const result = await new Promise<NotificationPermission>((resolve) => {
      const maybePromise = Notification.requestPermission((perm) => resolve(perm));
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(resolve).catch(() => resolve(Notification.permission));
      }
    });
    if (result === 'granted') {
      await ensurePushSubscription();
    }
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

export async function scheduleBackgroundNotification(
  title: string,
  body: string,
  delayMs = 0
): Promise<{ scheduledPush: boolean; scheduledSW: boolean }> {
  let scheduledPush = false;
  let scheduledSW = false;

  // 1. Schedule Service Worker background waitUntil timer (works up to 5 minutes after closing app)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_DELAYED_SW',
          title,
          body,
          delayMs,
          tag: 'gplx-study-reminder',
        });
        scheduledSW = true;
      }
    }
  } catch {
    // Ignore SW message errors
  }

  // 2. Dispatch real Web Push via Vercel Serverless Function (wakes Android FCM & iOS PWA even when completely closed)
  try {
    const sub = await ensurePushSubscription();
    if (sub && delayMs <= 55000) {
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: sub,
          title,
          body,
          delayMs,
          url: '/?reminder=1',
        }),
        keepalive: true,
      }).catch(() => {});
      scheduledPush = true;
    }
  } catch {
    // Ignore network errors
  }

  return { scheduledPush, scheduledSW };
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

  // Also trigger Web Push (delayMs: 0) so if the phone just went to background/lockscreen, FCM/APNs wakes it
  scheduleBackgroundNotification(title, body, 0).catch(() => {});

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

export function getMsUntilTodayTarget(
  timeStr: string,
  days: number[],
  now = new Date()
): number | null {
  if (!days.includes(now.getDay())) return null;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return null;
  const targetH = parseInt(parts[0], 10);
  const targetM = parseInt(parts[1], 10);
  if (isNaN(targetH) || isNaN(targetM)) return null;

  const targetDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetH,
    targetM,
    0,
    0
  );
  const diff = targetDate.getTime() - now.getTime();
  return diff > 0 ? diff : null;
}

let lastPreScheduledKey: string | null = null;

export async function syncScheduleWithBackground(schedule: StudySchedule): Promise<void> {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const msUntil = schedule.enabled
    ? getMsUntilTodayTarget(schedule.time, schedule.days, now)
    : null;

  // 1. Sync schedule state to Service Worker (for TimestampTrigger & CacheStorage)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.active) {
        reg.active.postMessage({
          type: 'SET_SCHEDULE',
          schedule: {
            ...schedule,
            nextTriggerTimeMs: msUntil ? Date.now() + msUntil : null,
          },
        });
      }
    }
  } catch {
    // Ignore
  }

  // 2. If target time is within the next 5 minutes, pre-schedule SW timer + Web Push
  if (
    schedule.enabled &&
    msUntil !== null &&
    msUntil > 0 &&
    msUntil <= 300000 &&
    schedule.lastNotifiedDate !== getTodayStr(now)
  ) {
    const key = `${getTodayStr(now)}_${schedule.time}`;
    if (lastPreScheduledKey !== key) {
      lastPreScheduledKey = key;
      await scheduleBackgroundNotification(
        'Đến giờ ôn thi GPLX 600 Câu!',
        `Mục tiêu hôm nay: ${schedule.dailyGoal} câu. Bấm để vào ôn tập ngay!`,
        msUntil
      );
    }
  }
}

export function createBackgroundTicker(onTick: () => void, intervalMs = 10000): () => void {
  if (typeof window === 'undefined') return () => {};

  try {
    const blob = new Blob(
      [
        `const id = setInterval(() => postMessage('tick'), ${intervalMs});
         onmessage = (e) => { if (e.data === 'stop') clearInterval(id); };`,
      ],
      { type: 'application/javascript' }
    );
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    worker.onmessage = () => onTick();
    return () => {
      worker.postMessage('stop');
      worker.terminate();
      URL.revokeObjectURL(url);
    };
  } catch {
    const id = window.setInterval(onTick, intervalMs);
    return () => window.clearInterval(id);
  }
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
