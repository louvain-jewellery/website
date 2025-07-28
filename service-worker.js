// service-worker.js
const CACHE_NAME = "louvain-jewellery-v1.0.0";

// Files to cache for better performance
const STATIC_CACHE_URLS = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/styles/header.css",
  "/styles/footer.css",
  "/styles/dropdown.css",
  "/styles/layout/design-nav.css",
  "/styles/layout/video-button.css",
  "/styles/layout/packaging.css",
  "/styles/index.css",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Failed to cache static assets:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Ensure the new service worker takes control immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes("fonts.g")) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(request)) {
      return await cacheFirst(request);
    }

    // Strategy 2: Network First for HTML pages
    if (isHTMLPage(request)) {
      return await networkFirst(request);
    }

    // Strategy 3: Stale While Revalidate for images and fonts
    if (isImageOrFont(request)) {
      return await staleWhileRevalidate(request);
    }

    // Default: Network First
    return await networkFirst(request);
  } catch (error) {
    console.error("Fetch failed:", error);

    // Return cached version if available
    return caches.match(request);
  }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

// Network First Strategy - for HTML pages
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy - for images and fonts
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    const cache = caches.open(CACHE_NAME);
    cache.then((c) => c.put(request, networkResponse.clone()));
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions to determine resource types
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.includes("/styles/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.includes("/favicon") ||
    url.pathname.endsWith(".webmanifest")
  );
}

function isHTMLPage(request) {
  return (
    request.destination === "document" ||
    request.headers.get("accept")?.includes("text/html")
  );
}

function isImageOrFont(request) {
  return (
    request.destination === "image" ||
    request.destination === "font" ||
    request.url.includes("fonts.googleapis.com") ||
    request.url.includes("fonts.gstatic.com")
  );
}

// Background sync for offline actions (optional)
self.addEventListener("backgroundsync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions, contact forms, etc.
  console.log("Background sync triggered");
}

// Push notification handler (optional)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || "New notification from Louvain Jewellery",
      icon: "/apple-touch-icon.png",
      badge: "/favicon-96x96.png",
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: "view",
          title: "View",
          icon: "/favicon-32x32.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/favicon-32x32.png",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "Louvain Jewellery",
        options
      )
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Share target handler (if using Web Share Target API)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/share-target" && event.request.method === "POST") {
    event.respondWith(handleSharedContent(event.request));
  }
});

async function handleSharedContent(request) {
  // Handle shared content (images, text, etc.)
  return Response.redirect("/", 303);
}
