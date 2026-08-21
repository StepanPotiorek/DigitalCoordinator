const VERSION = "__CACHE_VERSION__"
const SHELL_CACHE = `digicoord-shell-${VERSION}`
const ASSET_CACHE = `digicoord-assets-${VERSION}`

const SHELL_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

const CACHEABLE_PATTERN = /\.(css|js|png|svg|jpg|jpeg|webp|gif|woff2?|ico)$/

function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached
    return fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone()
        caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone))
      }
      return response
    })
  })
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/offline.html")),
      ),
    )
    return
  }

  if (url.pathname.startsWith("/_next/static/") || CACHEABLE_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
  }
})

self.addEventListener("push", (event) => {
  let data = { title: "Digital Coordinator", body: "You have a new update." }
  if (event.data) {
    try {
      data = event.data.json()
    } catch {
      data.body = event.data.text()
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
    }),
  )
})
