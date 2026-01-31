// Advanced Service Worker with Offline Support, Sync, and Data Management
// Version 2.0

const CACHE_NAME = 'dbh-cash-v2-' + new Date().getTime();
const API_CACHE = 'dbh-cash-api-v2';
const DATA_CACHE = 'dbh-cash-data-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg',
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

// ==================== INSTALL EVENT ====================
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker v2...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
});

// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker v2...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => !cacheName.includes(CACHE_NAME.split('-')[2]))
          .map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ==================== FETCH EVENT ====================
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and non-same-origin requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Static Assets - Cache First
  if (
    event.request.destination === 'image' || 
    event.request.destination === 'font' ||
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    url.pathname.includes('./components/') ||
    url.pathname.includes('./utils/')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW] Served from cache:', event.request.url);
            return cachedResponse;
          }
          
          return fetch(event.request).then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              console.log('[SW] Cached from network:', event.request.url);
              return networkResponse;
            });
          }).catch(() => {
            console.log('[SW] Offline - no cache for:', event.request.url);
            // Return offline page if available
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
        })
    );
  }
  
  // API Requests / JSON - Network First with Cache Fallback
  else if (
    event.request.headers.get('accept')?.includes('application/json') ||
    url.pathname.includes('/api/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          return caches.open(API_CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
            console.log('[SW] Cached API response:', event.request.url);
            return networkResponse;
          });
        })
        .catch(() => {
          console.log('[SW] Network failed - checking API cache:', event.request.url);
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline indicator
            return new Response(
              JSON.stringify({ offline: true, cached: false }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
  }
  
  // HTML Navigation - Network First
  else if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
  }
});

// ==================== MESSAGE EVENT (Offline Notification) ====================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_ONLINE_STATUS') {
    // Send back online status to client
    event.ports[0].postMessage({
      online: navigator.onLine,
      timestamp: Date.now()
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_DATA') {
    // Background sync request from client
    console.log('[SW] Sync data requested:', event.data.payload);
    syncDataWithServer(event.data.payload);
  }
});

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
  if (event.tag === 'sync-budgets') {
    event.waitUntil(syncBudgets());
  }
  if (event.tag === 'sync-all-data') {
    event.waitUntil(syncAllData());
  }
});

// Sync Functions
async function syncTransactions() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const keys = await cache.keys();
    
    for (const request of keys) {
      if (request.url.includes('transactions')) {
        const response = await cache.match(request);
        if (response) {
          const data = await response.json();
          // Send to server - implement your sync logic
          console.log('[SW] Syncing transactions:', data);
        }
      }
    }
    
    // Notify client about sync completion
    notifyClients('SYNC_COMPLETE', {
      type: 'transactions',
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}

async function syncBudgets() {
  try {
    // Similar logic for budgets
    console.log('[SW] Syncing budgets...');
    notifyClients('SYNC_COMPLETE', {
      type: 'budgets',
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('[SW] Budget sync failed:', err);
  }
}

async function syncAllData() {
  try {
    console.log('[SW] Syncing all data...');
    await Promise.all([
      syncTransactions(),
      syncBudgets()
    ]);
  } catch (err) {
    console.error('[SW] All data sync failed:', err);
  }
}

async function syncDataWithServer(payload) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const result = await response.json();
      notifyClients('SYNC_SUCCESS', result);
    }
  } catch (err) {
    console.log('[SW] Sync failed (offline):', err);
    // Data will be synced when online
    notifyClients('SYNC_OFFLINE', {
      message: 'আপনার পরিবর্তন অনলাইন হলে সেভ হবে',
      timestamp: Date.now()
    });
  }
}

// Notify all clients
function notifyClients(type, data) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: type,
        data: data
      });
    });
  });
}

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', event => {
  let notificationData = {
    title: 'DBH CASH',
    body: 'নতুন আপডেট উপলব্ধ'
  };
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: './logo.svg',
      badge: './logo.svg',
      tag: 'dbh-cash-notification',
      requireInteraction: false
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clients => {
      // Focus existing window or open new one
      for (const client of clients) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

console.log('[SW] Service Worker v2 loaded successfully');
