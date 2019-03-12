// Took help from:
// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/request
// and
// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for', event.request.url);
    // var cache = caches.open("my-cache");

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log('Found response in cache:', response);

                return response;
            }
            console.log('No response found in cache. About to fetch from network...');

            return fetch(event.request).then(function(response) {
                console.log('Response from network is:', response);

                var responseToCache = response.clone();

                caches.open("my-cache")
                    .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            }).catch(function(error) {
                console.error('Fetching failed:', error);

                throw error;
            });
        })
    );
});

