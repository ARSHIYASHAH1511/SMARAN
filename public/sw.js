// Firefly AI - Service Worker for Background Medication & Activity Reminders

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming messages from client (e.g. trigger notification from background tab)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, {
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        vibrate: [200, 100, 200, 100, 300],
        requireInteraction: true,
        ...options,
      })
    );
  }
});

// Handle notification click even when app is in the background or closed
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const clickedAction = event.action; // 'open_palace', 'mark_done', 'snooze', etc.
  const targetTab = notificationData.targetTab || (clickedAction === 'open_palace' ? 'palace' : 'home');

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's an existing open client, focus it and tell it what happened
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            action: clickedAction,
            targetTab: targetTab,
            reminderId: notificationData.reminderId,
            data: notificationData,
          });
          return;
        }
      }
      // If no window is open, open a new window pointing to target tab
      if (self.clients.openWindow) {
        const dest = `/?tab=${targetTab}&reminderId=${notificationData.reminderId || ''}&action=${clickedAction || ''}`;
        return self.clients.openWindow(dest);
      }
    })
  );
});
