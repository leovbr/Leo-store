/* LEOOSTORE Web Push service worker */
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data?.text() || "" }; }
  event.waitUntil(self.registration.showNotification(String(data.title || "LEOOSTORE.id").slice(0, 80), {
    body: String(data.body || "Ada kabar baru untuk kamu.").slice(0, 180),
    icon: "./assets/logo.png", badge: "./assets/logo.png",
    tag: String(data.tag || "leoostore-notification").slice(0, 100),
    data: { url: data.url || "./" }
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil((async () => {
    const list = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of list) if (client.url.startsWith(self.location.origin) && "focus" in client) {
      await client.focus(); if ("navigate" in client) await client.navigate(target); return;
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});