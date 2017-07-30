---
---
importScripts('/cache-polyfill.js');
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('iosiconify1').then(function (cache) {
            return cache.addAll([
                // Stylesheets
                // Pages and assets
                {% for page in site.html_pages %}
                '{{ page.url }}',
                {% endfor %}
                // Blog posts
                {% for post in site.posts %}
                    '{{ post.url }}',
                {% endfor %}
                '/jquery.min.js',{% for file in site.static_files %}
                '{{file.path}}',{% endfor %}
                '/sitemap.xml'

            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});