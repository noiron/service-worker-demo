console.log('This message is from service worker file.');

const cacheName = 'cache-name-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName));
});

self.addEventListener('fetch', async (event) => {
  if (event.request.destination === 'image') {
    // Open the cache
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        // Respond with the image from the cache or from the network
        return cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request.url).then((fetchedResponse) => {
              // Add the network response to the cache for future visits.
              // Note: we need to make a copy of the response to save it in
              // the cache and use the original as the request response.
              cache.put(event.request, fetchedResponse.clone());

              return fetchedResponse;
            })
          );
        });
      })
    );
  } else {
    return;
  }
});
