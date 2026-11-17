import { waitUntil } from '@vercel/functions';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  'BLiQuh0I2fR3ziFUixidbyvCxPwpJPDtYKdWCuyOqMMosIM1Wz-axwHitBxBdx5IdLPUOTNvoQA6k2inRCwJ4eI';
const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  'W1v2YODdUKQT7YxzSIXSLlrbSSRVvxmmtso-wStKfzk';

webpush.setVapidDetails(
  'mailto:support@taplaixe-gplx600.vercel.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Track latest scheduleKey per endpoint on warm instances to cancel superseded schedules
const latestScheduleByEndpoint = new Map();

function getSelfPushUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}/api/push`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      subscription,
      title,
      body,
      delayMs = 0,
      targetTimeMs,
      scheduleKey = null,
      url = '/?reminder=1',
      hop = 0,
    } = req.body || {};

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing push subscription' });
    }

    const currentHop = Number(hop) || 0;
    if (currentHop > 720) {
      return res.status(200).json({ ok: false, reason: 'max_hops_exceeded' });
    }

    if (scheduleKey) {
      if (currentHop === 0) {
        latestScheduleByEndpoint.set(subscription.endpoint, scheduleKey);
      } else {
        const activeKey = latestScheduleByEndpoint.get(subscription.endpoint);
        if (activeKey && activeKey !== scheduleKey) {
          return res.status(200).json({ ok: true, cancelled: true });
        }
      }
    }

    const now = Date.now();
    const target = targetTimeMs
      ? Number(targetTimeMs)
      : now + Math.max(0, Number(delayMs) || 0);
    const remainingMs = target - now;
    const selfUrl = getSelfPushUrl(req);

    // If due immediately (<= 0ms), send right away and return
    if (remainingMs <= 0) {
      const payload = JSON.stringify({
        title: title || 'Đến giờ ôn thi GPLX 600 Câu!',
        body: body || 'Bấm để vào ôn tập ngay hôm nay.',
        url,
        scheduleKey,
        timestamp: Date.now(),
      });

      await webpush.sendNotification(subscription, payload, {
        TTL: 86400,
        urgency: 'high',
      });

      return res.status(200).json({ ok: true, sent: true, hop: currentHop });
    }

    // Background execution using Vercel's official waitUntil:
    // Return 200 OK immediately so the caller (phone or previous hop) finishes in ~10ms,
    // while this invocation sleeps up to 6s (safely under Vercel Hobby's 10s limit) and either
    // sends the push or relays to hop + 1.
    const backgroundTask = (async () => {
      try {
        if (remainingMs <= 6000) {
          await new Promise((resolve) => setTimeout(resolve, remainingMs));

          if (scheduleKey) {
            const activeKey = latestScheduleByEndpoint.get(subscription.endpoint);
            if (activeKey && activeKey !== scheduleKey) return;
          }

          const payload = JSON.stringify({
            title: title || 'Đến giờ ôn thi GPLX 600 Câu!',
            body: body || 'Bấm để vào ôn tập ngay hôm nay.',
            url,
            scheduleKey,
            timestamp: Date.now(),
          });

          await webpush.sendNotification(subscription, payload, {
            TTL: 86400,
            urgency: 'high',
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 6000));

          if (scheduleKey) {
            const activeKey = latestScheduleByEndpoint.get(subscription.endpoint);
            if (activeKey && activeKey !== scheduleKey) return;
          }

          await fetch(selfUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              title,
              body,
              targetTimeMs: target,
              scheduleKey,
              url,
              hop: currentHop + 1,
            }),
          });
        }
      } catch {
        // Ignore background errors
      }
    })();

    waitUntil(backgroundTask);

    return res.status(200).json({
      ok: true,
      queued: true,
      hop: currentHop,
      remainingMs,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Push failed',
    });
  }
}
