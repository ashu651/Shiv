self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data.json(); } catch (e) {}
  const title = data.title || 'Snapzy';
  const options = { body: data.body || '', icon: '/vite.svg' };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});