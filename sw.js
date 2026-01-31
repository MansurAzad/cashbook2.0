const CACHE_NAME = 'budget-tracker-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.js',
  './utils/dataManager.js',
  './utils/gestureHooks.js',
  './components/UIComponents.js',
  './components/GestureUI.js',
  './components/Sidebar.js',
  './components/Header.js',
  './components/BottomNav.js',
  './components/Dashboard.js',
  './components/Transactions.js',
  './components/CalendarView.js',
  './components/Budget.js',
  './components/Goals.js',
  './components/Bills.js',
  './components/Investments.js',
  './components/Accounts.js',
  './components/Loans.js',
  './components/Tools.js',
  './components/Settings.js',
  './components/Reports.js',
  'https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js',
  'https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js',
  'https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting(); // Force activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients immediately
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Strategy: Cache First for Static Assets (Images, Fonts, Scripts)
  if (
    event.request.destination === 'image' || 
    event.request.destination === 'font' ||
    event.request.destination === 'script' ||
    event.request.destination === 'style'
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        });
      })
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for App Shell (HTML, internal JS)
  // Serve from cache immediately, then update cache from network in background
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
          // Network failed, nothing to do if we have cache
      });

      return cachedResponse || fetchPromise;
    })
  );
});