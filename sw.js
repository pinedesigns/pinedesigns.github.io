---
---

importScripts('/cache-polyfill.js');

var cacheUpToDate = true;

var urlsToCache = [];

/*posts*/
{% for post in site.posts %}urlsToCache.push("{{ post.url }}");
{% endfor %}
/*pages*/
{% for page in site.pages %}{% if page.permalink %}urlsToCache.push("{{ page.permalink }}");{% endif %}{% if page.url %}urlsToCache.push("{{ page.url }}");{% endif %}
{% endfor %}
/* MY MODIFICATIONS */

/*static files*/
{% for file in site.static_files %}urlsToCache.push("{{file.path}}");
{% endfor %}
/*html pages*/
{% for page in site.html_pages %}urlsToCache.push("{{ page.url }}");
{% endfor %}
/* END MY MODIFICATIONS */

var CACHE_NAME = '{{ site.title | slugify }}-cache-{{site.git.last_commit.short_sha}}';

/*self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});*/

var name;

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheKeys) { 
        for(var i = 0; i < cacheKeys.length; i++) {
            name = cacheKeys[i];
            cacheUpToDate = (name == CACHE_NAME); // ex: ["test-cache"]
            console.log("cacheUpToDate is " + cacheUpToDate + " - " + name);
            if(!cacheUpToDate) {
                var cLogName = name;
                caches.delete(name).then(function() { 
                  console.log('Cache ' + cLogName + ' successfully deleted!'); 
                });
            }
        }
    })
  );
});

caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
})
 
/*self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});*/

self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
    /*caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    });*/
});