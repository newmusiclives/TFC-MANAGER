/**
 * Web Push Notification helpers.
 *
 * - requestNotificationPermission – asks the user for permission
 * - sendLocalNotification – fires a browser Notification
 * - subscribeToPush – subscribes via PushManager (needs VAPID key in prod)
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window))
    return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendLocalNotification(
  title: string,
  body: string,
  icon?: string
): void {
  if (typeof window === "undefined" || Notification.permission !== "granted")
    return;
  new Notification(title, {
    body,
    icon: icon || "/icon-192.png",
    badge: "/icon-192.png",
  });
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator))
    return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "placeholder-vapid-key",
    });
  } catch {
    return null;
  }
}
