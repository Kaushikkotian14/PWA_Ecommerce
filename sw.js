const cacheName = 'comrade-v1';
const staticAssets = [
    './',
    './index.html',
    './about.html',
    './drip.html',
    './electronics.html',
    './furniture.html',
    './general.html',
    './index.html',
    './laptops.html',
    './phones.html',
    './sneakers.html',
    './manifest.json',
    './style.css',
    // Add other assets you want to cache
];

// Install event - cache static assets
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

// Activate event
self.addEventListener('activate', e => {
    self.clients.claim();
});

// Fetch event - serve assets from cache or fetch from network
self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);
  
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}

self.addEventListener('push', event => {
    let data = { title: 'Hello Kaushik', body: 'You have new updates!' };
    try {
      if (event.data) {
          data = event.data.json(); // Attempt to parse the incoming data as JSON
      }
  } catch (error) {
      console.error('Error parsing push event data:', error);
     
  }

    const options = {
        body: data.body,
        icon: 'images/youtube.png',
        badge: 'images/youtube.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});


self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(clients.openWindow('https://www.youtube.com/'));
});


self.addEventListener('sync', event => {
    if (event.tag === 'your-sync-tag') {
        event.waitUntil(
           
            console.log('Background sync event triggered')
        );
    }
});
