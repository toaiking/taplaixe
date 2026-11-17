const CACHE_NAME = 'gplx-600-v5';
const SCHEDULE_CACHE_KEY = '/__gplx_schedule_state__';
const APP_ICON_URL = '/icons/icon-192-v3.png?v=3';

let activeScheduleToken = 0;
const shownScheduleKeys = new Set();

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function showStudyOSNotification(
  title,
  body,
  tag = 'gplx-study-reminder',
  url = '/?reminder=1',
  scheduleKey = null
) {
  if (scheduleKey) {
    if (shownScheduleKeys.has(scheduleKey)) {
      return;
    }
    shownScheduleKeys.add(scheduleKey);
  }

  return self.registration.showNotification(title || 'Đến giờ ôn thi GPLX 600 Câu!', {
    body: body || 'Mục tiêu hôm nay đang chờ bạn hoàn thành. Bấm để vào ôn ngay!',
    icon: APP_ICON_URL,
    badge: APP_ICON_URL,
    tag,
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 300],
    data: { url, scheduleKey },
  });
}

// 1. Handle real Web Push events (works when app is completely closed on Android & iOS PWA)
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Đến giờ ôn thi GPLX 600 Câu!',
    body: 'Bấm để vào ôn tập ngay hôm nay!',
    url: '/?reminder=1',
    scheduleKey: null,
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  event.waitUntil(
    showStudyOSNotification(
      payload.title,
      payload.body,
      'gplx-study-reminder',
      payload.url,
      payload.scheduleKey
    )
  );
});

// 2. Handle messages from client (delayed background triggers + schedule sync + skipWaiting)
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (data.type === 'SCHEDULE_DELAYED_SW') {
    const token = ++activeScheduleToken;
    const title = data.title || 'Đến giờ ôn thi GPLX 600 Câu!';
    const body = data.body || 'Bấm để vào ôn tập ngay!';
    const tag = data.tag || 'gplx-study-reminder';
    const scheduleKey = data.scheduleKey || null;
    const subscription = data.subscription || null;
    const targetTimeMs =
      data.targetTimeMs || Date.now() + Math.max(0, Number(data.delayMs) || 0);

    event.waitUntil(
      (async () => {
        // Also dispatch from inside Service Worker so page unload never aborts the request
        if (subscription && subscription.endpoint) {
          fetch('/api/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              title,
              body,
              targetTimeMs,
              scheduleKey,
              url: '/?reminder=1',
              hop: 0,
            }),
          }).catch(() => {});
        }

        // Chunked 4s sleep loop inside SW waitUntil
        while (token === activeScheduleToken) {
          const rem = targetTimeMs - Date.now();
          if (rem <= 0) {
            await showStudyOSNotification(title, body, tag, '/?reminder=1', scheduleKey);
            break;
          }
          const step = Math.min(rem, 4000);
          await new Promise((r) => setTimeout(r, step));
        }
      })()
    );
  }

  if (data.type === 'SET_SCHEDULE') {
    const schedule = data.schedule;
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(
            SCHEDULE_CACHE_KEY,
            new Response(JSON.stringify(schedule), {
              headers: { 'Content-Type': 'application/json' },
            })
          );

          // If browser supports TimestampTrigger (Notification Triggers API), schedule OS-level trigger
          if (
            'showTrigger' in Notification.prototype &&
            schedule &&
            schedule.enabled &&
            schedule.nextTriggerTimeMs
          ) {
            try {
              const TriggerClass = self.TimestampTrigger;
              if (TriggerClass && schedule.nextTriggerTimeMs > Date.now()) {
                await self.registration.showNotification('Đến giờ ôn thi GPLX 600 Câu!', {
                  body: `Mục tiêu hôm nay: ${schedule.dailyGoal || 25} câu. Bấm để vào ôn tập ngay!`,
                  icon: APP_ICON_URL,
                  badge: APP_ICON_URL,
                  tag: 'gplx-study-scheduled-trigger',
                  showTrigger: new TriggerClass(schedule.nextTriggerTimeMs),
                  data: { url: '/?reminder=1' },
                });
              }
            } catch {
              // TimestampTrigger not enabled on this device
            }
          }
        } catch {
          // Ignore cache errors
        }
      })()
    );
  }
});

// 3. Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/?reminder=1';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICKED' });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/version.json') return;

  // Always bypass old cache for icons, favicon, and manifest (network-first with cache reload)
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/favicon.svg' ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for static assets and traffic sign images
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Network-first for HTML/navigation
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
  );
});
