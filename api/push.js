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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, title, body, delayMs = 0, url = '/?reminder=1' } = req.body || {};

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing push subscription' });
    }

    const clampedDelay = Math.max(0, Math.min(Number(delayMs) || 0, 55000));
    if (clampedDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, clampedDelay));
    }

    const payload = JSON.stringify({
      title: title || 'Đến giờ ôn thi GPLX 600 Câu!',
      body: body || 'Bấm để vào ôn tập ngay hôm nay.',
      url,
      timestamp: Date.now(),
    });

    await webpush.sendNotification(subscription, payload, {
      TTL: 86400,
      urgency: 'high',
    });

    return res.status(200).json({ ok: true, delayedMs: clampedDelay });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Push failed',
    });
  }
}
