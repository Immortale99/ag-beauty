const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerNotifications() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications non supportées');
      return false;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey
    });

    await saveSubscription(subscription);
    return true;
  } catch (error) {
    console.error('Erreur notification:', error);
    return false;
  }
}
