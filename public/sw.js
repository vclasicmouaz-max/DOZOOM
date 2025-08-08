const CACHE_NAME = 'dozoom-v1';
const urlsToCache = [
  '/',
  '/globals.css',
  '/dozoom-logo-cinematic.png', // DoZOOM cinematic logo
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background sync for offline functionality
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync user data when back online
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New content available on DoZOOM!',
    icon: '/dozoom-logo-cinematic.png',
    badge: '/dozoom-logo-cinematic.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Watch Now',
        icon: '/images/checkmark.png' // Placeholder, ideally a DoZOOM themed icon
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png' // Placeholder, ideally a DoZOOM themed icon
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DoZOOM', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
